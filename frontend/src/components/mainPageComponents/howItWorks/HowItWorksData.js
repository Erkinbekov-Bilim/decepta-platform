import icons from "../../../assets/icons/icons"

const { CreateAccountIcon, TopUpBalanceIcon, StartTradingIcon} = icons

const howItWorksData = [
  {
    id: "create_account",
    titleKey: "how.create_account",
    descriptionKey: "how.create_account.description",
    icon: CreateAccountIcon,
    link: "/signup",
    link_text: "how.create_account.link_text"
  },
  {
    id: "top_up_balance",
    titleKey: "how.top_up_balance",
    descriptionKey: "how.top_up_balance.description",
    icon: TopUpBalanceIcon,
    link: "/buy",
    link_text: "how.top_up_balance.link_text"
  },
  {
    id: "start_trading",
    titleKey: "how.start_trading",
    descriptionKey: "how.start_trading.description",
    icon: StartTradingIcon,
    link: "/spot",
    link_text: "how.start_trading.link_text"
  }
]

export default howItWorksData
