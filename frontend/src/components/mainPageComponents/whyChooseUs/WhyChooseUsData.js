import icons from "../../../assets/icons/icons";

const { LowFeelsIcon, SecurityIcon, FastTransactionsIcon, SupportWhyIcon } = icons;

const whyChooseData = [
  {
    id: "low_fees",
    titleKey: "why.low_fees",
    icon: LowFeelsIcon,
    subItems: [
      { number: 1, titleKey: "why.low_fees.reason1.title" },
      { number: 2, titleKey: "why.low_fees.reason2.title" },
      { number: 3, titleKey: "why.low_fees.reason3.title" },
    ],
  },
  {
    id: "security",
    titleKey: "why.security",
    icon: SecurityIcon,
    subItems: [
      { number: 1, titleKey: "why.security.reason1.title" },
      { number: 2, titleKey: "why.security.reason2.title" },
      { number: 3, titleKey: "why.security.reason3.title" },
    ],
  },
  {
    id: "fast_transactions",
    titleKey: "why.fast_transactions",
    icon: FastTransactionsIcon,
    subItems: [
      { number: 1, titleKey: "why.fast_transactions.reason1.title" },
      { number: 2, titleKey: "why.fast_transactions.reason2.title" },
      { number: 3, titleKey: "why.fast_transactions.reason3.title" },
    ],
  },
  {
    id: "support",
    titleKey: "why.support",
    icon: SupportWhyIcon,
    subItems: [
      { number: 1, titleKey: "why.support.reason1.title" },
      { number: 2, titleKey: "why.support.reason2.title" },
      { number: 3, titleKey: "why.support.reason3.title" },
    ],
  },
];

export default whyChooseData;
