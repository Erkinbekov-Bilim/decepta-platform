import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    detection: {
      order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          Buy: "Buy",
          Markets: "Markets",
          Trade: "Trade",
          Spot: "Spot",
          P2P: "P2P",
          Convert: "Convert",
          Earn: "Earn",
          Wallet: "Wallet",
          More: "More",
          News: "News",
          "About Us": "About Us",
          Profile: "Profile",
          Dashboard: "Dashboard",
          Orders: "Orders",
          Account: "Account",
          Support: "Support",
          "Log in": "Log in",
          "Sign up": "Sign up",
          "Log out": "Log out",
        }
      },
      ru: {
        translation: {
          Buy: "Купить",
          Markets: "Маркеты",
          Trade: "Торговля",
          Spot: "Spot",
          P2P: "P2P",
          Convert: "Конвертация",
          Earn: "Earn",
          Wallet: "Кошелек",
          More: "Подробнее",
          News: "Новости",
          "About Us": "О нас",
          Profile: "Профиль",
          Dashboard: "Панель инструментов",
          Orders: "Ордера",
          Account: "Аккаунт",
          Support: "Поддержка",
          "Log in": "Войти",
          "Sign up": "Зарегистрироваться",
          "Log out": "Выйти",
        }
      },
      zh: {
        translation: {
          Buy: "购买",
          Markets: "市场",
          Trade: "交易",
          Spot: "现货",
          P2P: "C2C",
          Convert: "转换",
          Earn: "赚钱",
          Wallet: "钱包",
          More: "更多",
          News: "新闻",
          "About Us": "关于我们",
          Profile: "个人资料",
          Dashboard: "仪表板",
          Orders: "订单",
          Account: "账户",
          Support: "支持",
          "Log in": "登录",
          "Sign up": "注册",
          "Log out": "退出",
        }
      }
    }
  });