import React, { useEffect, useState } from "react";
import classes from "./MainCryptoCard.module.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api";

const formatPrice = (price) =>
  `$${parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const MainCryptoCard = () => {

  const { t } = useTranslation();
  const info_text = {
    popular: t("Popular"),
    new: t("new"),
    new_listings: t("New Listings"),
    view_all: t("View All")
  }

  const [allCoins, setAllCoins] = useState([]);
  const [prices, setPrices] = useState({});
  const [tab, setTab] = useState("popular");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await api.get("api/proxy/coins/");
        setAllCoins(res.data);
      } catch (error) {
        console.error("Failed to fetch coins from proxy:", error);
      }
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    if (allCoins.length === 0) return;

    const trackedCoins = allCoins.map((coin) => `${coin.symbol}usdt`).join("/");
    const streams = trackedCoins
      .split("/")
      .map((s) => `${s.toLowerCase()}@miniTicker`)
      .join("/");

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    );

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { s, c, P } = message.data;
      const symbol = s.replace("USDT", "").toLowerCase();
      setPrices((prev) => ({
        ...prev,
        [symbol]: {
          price: c,
          change: P,
        },
      }));
    };

    return () => ws.close();
  }, [allCoins]);

  const popularCoins = allCoins.slice(0, 5);
  const newListingCoins = allCoins.slice(5, 10);
  const displayedCoins = tab === `${info_text.popular.toLowerCase()}` ? popularCoins : newListingCoins;

  return (
    <div className={classes.card_container}>
      <div className={classes.card_links}>
        <div className={classes.card_tabs}>
          <button
            className={tab === `${info_text.popular.toLowerCase()}` ? classes.active : ""}
            onClick={() => setTab(`${info_text.popular.toLowerCase()}`)}
          >
            {info_text.popular}
          </button>
          <button
            className={tab === `${info_text.new.toLowerCase()}` ? classes.active : ""}
            onClick={() => setTab(`${info_text.new.toLowerCase()}`)}
          >
            {info_text.new_listings}
          </button>
        </div>
        <Link to="/markets" className={classes.card_view_all}>
          {info_text.view_all} &gt;
        </Link>
      </div>

      <div className={classes.card_body}>
        {displayedCoins.map((coin) => {
          const priceData = prices[coin.symbol.toLowerCase()] || {};
          const change = parseFloat(priceData.change || coin.price_change_percentage_24h || 0);
          return (
            <div key={coin.id} className={classes.card_item}>
              <div className={classes.card_item_naming}>
                <img src={coin.image} alt={coin.symbol} className={classes.card_item_icon} />
                <div className={classes.card_item_info}>
                  <div className={classes.card_item_symbol}>{coin.symbol.toUpperCase()}</div>
                  <div className={classes.card_item_name}>{coin.name}</div>
                </div>
              </div>
              <div className={classes.card_item_price}>
                <span>{priceData.price ? formatPrice(priceData.price) : formatPrice(coin.current_price)}</span>
                <span
                  className={
                    change >= 0 ? classes.positive : classes.negative
                  }
                >
                  {change.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainCryptoCard;
