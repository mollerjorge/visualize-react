import Button from "./Button";

import mixpanel from "mixpanel-browser";
import { track } from "@vercel/analytics";

import pricingComments from "../images/pricing-commets.webp";
import silverMedal from "../images/silver_medal.webp";
import glassTrophy from "../images/glass_trophy.webp";
import goldMedal from "../images/gold_medal.webp";

const Pricings = [
  {
    title: "Infographics",
    price: "$34.00",
    href: "https://georgemoller.lemonsqueezy.com/checkout/buy/185f28df-b087-4a7c-a7ac-c797fdbc14cf",
    fullPrice: "$68.00",
    content: [
      {
        name: "107 infographics",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.25 10C0.25 4.615 4.615 0.25 10 0.25C15.385 0.25 19.75 4.615 19.75 10C19.75 15.385 15.385 19.75 10 19.75C4.615 19.75 0.25 15.385 0.25 10ZM13.61 8.186C13.67 8.10605 13.7134 8.01492 13.7377 7.91795C13.762 7.82098 13.7666 7.72014 13.7514 7.62135C13.7361 7.52257 13.7012 7.42782 13.6489 7.3427C13.5965 7.25757 13.5276 7.18378 13.4463 7.12565C13.3649 7.06753 13.2728 7.02624 13.1753 7.00423C13.0778 6.98221 12.9769 6.97991 12.8785 6.99746C12.7801 7.01501 12.6862 7.05205 12.6023 7.10641C12.5184 7.16077 12.4462 7.23135 12.39 7.314L9.154 11.844L7.53 10.22C7.38783 10.0875 7.19978 10.0154 7.00548 10.0188C6.81118 10.0223 6.62579 10.101 6.48838 10.2384C6.35097 10.3758 6.27225 10.5612 6.26882 10.7555C6.2654 10.9498 6.33752 11.1378 6.47 11.28L8.72 13.53C8.79699 13.6069 8.8898 13.6662 8.99199 13.7036C9.09418 13.7411 9.20329 13.7559 9.31176 13.7469C9.42023 13.738 9.52546 13.7055 9.62013 13.6519C9.7148 13.5982 9.79665 13.5245 9.86 13.436L13.61 8.186Z"
              fill="#34D399"
            />
          </svg>
        ),
      },
      {
        name: "Bonus gift: React interview Q&A ebook.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.5 4.31234C6.5 3.40337 7.23687 2.6665 8.14583 2.6665H8.22272C8.98349 2.6665 9.65418 3.16552 9.87279 3.8942L10.492 5.95817H8.14583C7.23687 5.95817 6.5 5.22131 6.5 4.31234ZM14.8542 5.95817H12.508L13.1272 3.8942C13.3458 3.16552 14.0165 2.6665 14.7773 2.6665H14.8542C15.7631 2.6665 16.5 3.40337 16.5 4.31234C16.5 5.22131 15.7631 5.95817 14.8542 5.95817ZM11.6905 3.46318L11.5 4.09809L11.3095 3.46318C10.9006 2.10002 9.6459 1.1665 8.22272 1.1665H8.14583C6.40844 1.1665 5 2.57494 5 4.31234C5 4.92887 5.17736 5.50398 5.48384 5.98942H3.35417C2.1633 5.98942 1.19792 6.95481 1.19792 8.14567C1.19792 9.33653 2.1633 10.3019 3.35417 10.3019H19.6458C20.8367 10.3019 21.8021 9.33653 21.8021 8.14567C21.8021 6.95481 20.8367 5.98942 19.6458 5.98942H17.5162C17.8226 5.50398 18 4.92887 18 4.31234C18 2.57494 16.5916 1.1665 14.8542 1.1665H14.7773C13.3541 1.1665 12.0994 2.10002 11.6905 3.46318ZM10.7812 12.2349L10.7813 12.2452V15.5728C10.7813 15.9697 11.103 16.2915 11.5 16.2915C11.897 16.2915 12.2188 15.9697 12.2188 15.5728V12.2452L12.2188 12.2349C12.2212 11.9623 12.4416 11.7419 12.7142 11.7394L12.7245 11.7394H19.0854C19.3654 11.7394 19.5055 11.7394 19.6124 11.7939C19.7065 11.8419 19.783 11.9183 19.8309 12.0124C19.8854 12.1194 19.8854 12.2594 19.8854 12.5394V15.4019C19.8854 17.6421 19.8854 18.7622 19.4494 19.6179C19.066 20.3705 18.454 20.9825 17.7014 21.3659C16.8457 21.8019 15.7256 21.8019 13.4854 21.8019H9.51459C7.27437 21.8019 6.15427 21.8019 5.29862 21.3659C4.54597 20.9825 3.93405 20.3705 3.55056 19.6179C3.11458 18.7622 3.11458 17.6421 3.11458 15.4019V12.5394C3.11458 12.2594 3.11458 12.1194 3.16908 12.0124C3.21702 11.9183 3.29351 11.8419 3.38759 11.7939C3.49455 11.7394 3.63456 11.7394 3.91458 11.7394H10.2755L10.2858 11.7394C10.5584 11.7419 10.7788 11.9623 10.7812 12.2349Z"
              fill="#34D399"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Video Course",
    price: "$149.00",
    fullPrice: "$298.00",
    background: "border border-purple-2 !bg-purple-2 !bg-opacity-10 px-[27px]",
    href: "https://georgemoller.lemonsqueezy.com/checkout/buy/992390e3-36f8-4ee7-8200-2ba781004206",
    content: [
      {
        name: "77 video tutorials",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.25 10C0.25 4.615 4.615 0.25 10 0.25C15.385 0.25 19.75 4.615 19.75 10C19.75 15.385 15.385 19.75 10 19.75C4.615 19.75 0.25 15.385 0.25 10ZM13.61 8.186C13.67 8.10605 13.7134 8.01492 13.7377 7.91795C13.762 7.82098 13.7666 7.72014 13.7514 7.62135C13.7361 7.52257 13.7012 7.42782 13.6489 7.3427C13.5965 7.25757 13.5276 7.18378 13.4463 7.12565C13.3649 7.06753 13.2728 7.02624 13.1753 7.00423C13.0778 6.98221 12.9769 6.97991 12.8785 6.99746C12.7801 7.01501 12.6862 7.05205 12.6023 7.10641C12.5184 7.16077 12.4462 7.23135 12.39 7.314L9.154 11.844L7.53 10.22C7.38783 10.0875 7.19978 10.0154 7.00548 10.0188C6.81118 10.0223 6.62579 10.101 6.48838 10.2384C6.35097 10.3758 6.27225 10.5612 6.26882 10.7555C6.2654 10.9498 6.33752 11.1378 6.47 11.28L8.72 13.53C8.79699 13.6069 8.8898 13.6662 8.99199 13.7036C9.09418 13.7411 9.20329 13.7559 9.31176 13.7469C9.42023 13.738 9.52546 13.7055 9.62013 13.6519C9.7148 13.5982 9.79665 13.5245 9.86 13.436L13.61 8.186Z"
              fill="#34D399"
            />
          </svg>
        ),
      },
      {
        name: "107 infographics",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.25 10C0.25 4.615 4.615 0.25 10 0.25C15.385 0.25 19.75 4.615 19.75 10C19.75 15.385 15.385 19.75 10 19.75C4.615 19.75 0.25 15.385 0.25 10ZM13.61 8.186C13.67 8.10605 13.7134 8.01492 13.7377 7.91795C13.762 7.82098 13.7666 7.72014 13.7514 7.62135C13.7361 7.52257 13.7012 7.42782 13.6489 7.3427C13.5965 7.25757 13.5276 7.18378 13.4463 7.12565C13.3649 7.06753 13.2728 7.02624 13.1753 7.00423C13.0778 6.98221 12.9769 6.97991 12.8785 6.99746C12.7801 7.01501 12.6862 7.05205 12.6023 7.10641C12.5184 7.16077 12.4462 7.23135 12.39 7.314L9.154 11.844L7.53 10.22C7.38783 10.0875 7.19978 10.0154 7.00548 10.0188C6.81118 10.0223 6.62579 10.101 6.48838 10.2384C6.35097 10.3758 6.27225 10.5612 6.26882 10.7555C6.2654 10.9498 6.33752 11.1378 6.47 11.28L8.72 13.53C8.79699 13.6069 8.8898 13.6662 8.99199 13.7036C9.09418 13.7411 9.20329 13.7559 9.31176 13.7469C9.42023 13.738 9.52546 13.7055 9.62013 13.6519C9.7148 13.5982 9.79665 13.5245 9.86 13.436L13.61 8.186Z"
              fill="#34D399"
            />
          </svg>
        ),
      },
      {
        name: "Video course explaining infographics",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.25 10C0.25 4.615 4.615 0.25 10 0.25C15.385 0.25 19.75 4.615 19.75 10C19.75 15.385 15.385 19.75 10 19.75C4.615 19.75 0.25 15.385 0.25 10ZM13.61 8.186C13.67 8.10605 13.7134 8.01492 13.7377 7.91795C13.762 7.82098 13.7666 7.72014 13.7514 7.62135C13.7361 7.52257 13.7012 7.42782 13.6489 7.3427C13.5965 7.25757 13.5276 7.18378 13.4463 7.12565C13.3649 7.06753 13.2728 7.02624 13.1753 7.00423C13.0778 6.98221 12.9769 6.97991 12.8785 6.99746C12.7801 7.01501 12.6862 7.05205 12.6023 7.10641C12.5184 7.16077 12.4462 7.23135 12.39 7.314L9.154 11.844L7.53 10.22C7.38783 10.0875 7.19978 10.0154 7.00548 10.0188C6.81118 10.0223 6.62579 10.101 6.48838 10.2384C6.35097 10.3758 6.27225 10.5612 6.26882 10.7555C6.2654 10.9498 6.33752 11.1378 6.47 11.28L8.72 13.53C8.79699 13.6069 8.8898 13.6662 8.99199 13.7036C9.09418 13.7411 9.20329 13.7559 9.31176 13.7469C9.42023 13.738 9.52546 13.7055 9.62013 13.6519C9.7148 13.5982 9.79665 13.5245 9.86 13.436L13.61 8.186Z"
              fill="#34D399"
            />
          </svg>
        ),
      },
      {
        name: "Bonus gift: React interview Q&A ebook.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.5 4.31234C6.5 3.40337 7.23687 2.6665 8.14583 2.6665H8.22272C8.98349 2.6665 9.65418 3.16552 9.87279 3.8942L10.492 5.95817H8.14583C7.23687 5.95817 6.5 5.22131 6.5 4.31234ZM14.8542 5.95817H12.508L13.1272 3.8942C13.3458 3.16552 14.0165 2.6665 14.7773 2.6665H14.8542C15.7631 2.6665 16.5 3.40337 16.5 4.31234C16.5 5.22131 15.7631 5.95817 14.8542 5.95817ZM11.6905 3.46318L11.5 4.09809L11.3095 3.46318C10.9006 2.10002 9.6459 1.1665 8.22272 1.1665H8.14583C6.40844 1.1665 5 2.57494 5 4.31234C5 4.92887 5.17736 5.50398 5.48384 5.98942H3.35417C2.1633 5.98942 1.19792 6.95481 1.19792 8.14567C1.19792 9.33653 2.1633 10.3019 3.35417 10.3019H19.6458C20.8367 10.3019 21.8021 9.33653 21.8021 8.14567C21.8021 6.95481 20.8367 5.98942 19.6458 5.98942H17.5162C17.8226 5.50398 18 4.92887 18 4.31234C18 2.57494 16.5916 1.1665 14.8542 1.1665H14.7773C13.3541 1.1665 12.0994 2.10002 11.6905 3.46318ZM10.7812 12.2349L10.7813 12.2452V15.5728C10.7813 15.9697 11.103 16.2915 11.5 16.2915C11.897 16.2915 12.2188 15.9697 12.2188 15.5728V12.2452L12.2188 12.2349C12.2212 11.9623 12.4416 11.7419 12.7142 11.7394L12.7245 11.7394H19.0854C19.3654 11.7394 19.5055 11.7394 19.6124 11.7939C19.7065 11.8419 19.783 11.9183 19.8309 12.0124C19.8854 12.1194 19.8854 12.2594 19.8854 12.5394V15.4019C19.8854 17.6421 19.8854 18.7622 19.4494 19.6179C19.066 20.3705 18.454 20.9825 17.7014 21.3659C16.8457 21.8019 15.7256 21.8019 13.4854 21.8019H9.51459C7.27437 21.8019 6.15427 21.8019 5.29862 21.3659C4.54597 20.9825 3.93405 20.3705 3.55056 19.6179C3.11458 18.7622 3.11458 17.6421 3.11458 15.4019V12.5394C3.11458 12.2594 3.11458 12.1194 3.16908 12.0124C3.21702 11.9183 3.29351 11.8419 3.38759 11.7939C3.49455 11.7394 3.63456 11.7394 3.91458 11.7394H10.2755L10.2858 11.7394C10.5584 11.7419 10.7788 11.9623 10.7812 12.2349Z"
              fill="#34D399"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Videos & Infographics",
    price: "$59.00",
    fullPrice: "$84.00",
    href: "https://georgemoller.lemonsqueezy.com/checkout/buy/601f46d6-3f75-4ab8-8ae1-70a5f1006c50",
    content: [
      {
        name: "77 video tutorials",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.25 10C0.25 4.615 4.615 0.25 10 0.25C15.385 0.25 19.75 4.615 19.75 10C19.75 15.385 15.385 19.75 10 19.75C4.615 19.75 0.25 15.385 0.25 10ZM13.61 8.186C13.67 8.10605 13.7134 8.01492 13.7377 7.91795C13.762 7.82098 13.7666 7.72014 13.7514 7.62135C13.7361 7.52257 13.7012 7.42782 13.6489 7.3427C13.5965 7.25757 13.5276 7.18378 13.4463 7.12565C13.3649 7.06753 13.2728 7.02624 13.1753 7.00423C13.0778 6.98221 12.9769 6.97991 12.8785 6.99746C12.7801 7.01501 12.6862 7.05205 12.6023 7.10641C12.5184 7.16077 12.4462 7.23135 12.39 7.314L9.154 11.844L7.53 10.22C7.38783 10.0875 7.19978 10.0154 7.00548 10.0188C6.81118 10.0223 6.62579 10.101 6.48838 10.2384C6.35097 10.3758 6.27225 10.5612 6.26882 10.7555C6.2654 10.9498 6.33752 11.1378 6.47 11.28L8.72 13.53C8.79699 13.6069 8.8898 13.6662 8.99199 13.7036C9.09418 13.7411 9.20329 13.7559 9.31176 13.7469C9.42023 13.738 9.52546 13.7055 9.62013 13.6519C9.7148 13.5982 9.79665 13.5245 9.86 13.436L13.61 8.186Z"
              fill="#34D399"
            />
          </svg>
        ),
      },
      {
        name: "107 infographics",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.25 10C0.25 4.615 4.615 0.25 10 0.25C15.385 0.25 19.75 4.615 19.75 10C19.75 15.385 15.385 19.75 10 19.75C4.615 19.75 0.25 15.385 0.25 10ZM13.61 8.186C13.67 8.10605 13.7134 8.01492 13.7377 7.91795C13.762 7.82098 13.7666 7.72014 13.7514 7.62135C13.7361 7.52257 13.7012 7.42782 13.6489 7.3427C13.5965 7.25757 13.5276 7.18378 13.4463 7.12565C13.3649 7.06753 13.2728 7.02624 13.1753 7.00423C13.0778 6.98221 12.9769 6.97991 12.8785 6.99746C12.7801 7.01501 12.6862 7.05205 12.6023 7.10641C12.5184 7.16077 12.4462 7.23135 12.39 7.314L9.154 11.844L7.53 10.22C7.38783 10.0875 7.19978 10.0154 7.00548 10.0188C6.81118 10.0223 6.62579 10.101 6.48838 10.2384C6.35097 10.3758 6.27225 10.5612 6.26882 10.7555C6.2654 10.9498 6.33752 11.1378 6.47 11.28L8.72 13.53C8.79699 13.6069 8.8898 13.6662 8.99199 13.7036C9.09418 13.7411 9.20329 13.7559 9.31176 13.7469C9.42023 13.738 9.52546 13.7055 9.62013 13.6519C9.7148 13.5982 9.79665 13.5245 9.86 13.436L13.61 8.186Z"
              fill="#34D399"
            />
          </svg>
        ),
      },
      {
        name: "Bonus gift: React interview Q&A ebook.",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.5 4.31234C6.5 3.40337 7.23687 2.6665 8.14583 2.6665H8.22272C8.98349 2.6665 9.65418 3.16552 9.87279 3.8942L10.492 5.95817H8.14583C7.23687 5.95817 6.5 5.22131 6.5 4.31234ZM14.8542 5.95817H12.508L13.1272 3.8942C13.3458 3.16552 14.0165 2.6665 14.7773 2.6665H14.8542C15.7631 2.6665 16.5 3.40337 16.5 4.31234C16.5 5.22131 15.7631 5.95817 14.8542 5.95817ZM11.6905 3.46318L11.5 4.09809L11.3095 3.46318C10.9006 2.10002 9.6459 1.1665 8.22272 1.1665H8.14583C6.40844 1.1665 5 2.57494 5 4.31234C5 4.92887 5.17736 5.50398 5.48384 5.98942H3.35417C2.1633 5.98942 1.19792 6.95481 1.19792 8.14567C1.19792 9.33653 2.1633 10.3019 3.35417 10.3019H19.6458C20.8367 10.3019 21.8021 9.33653 21.8021 8.14567C21.8021 6.95481 20.8367 5.98942 19.6458 5.98942H17.5162C17.8226 5.50398 18 4.92887 18 4.31234C18 2.57494 16.5916 1.1665 14.8542 1.1665H14.7773C13.3541 1.1665 12.0994 2.10002 11.6905 3.46318ZM10.7812 12.2349L10.7813 12.2452V15.5728C10.7813 15.9697 11.103 16.2915 11.5 16.2915C11.897 16.2915 12.2188 15.9697 12.2188 15.5728V12.2452L12.2188 12.2349C12.2212 11.9623 12.4416 11.7419 12.7142 11.7394L12.7245 11.7394H19.0854C19.3654 11.7394 19.5055 11.7394 19.6124 11.7939C19.7065 11.8419 19.783 11.9183 19.8309 12.0124C19.8854 12.1194 19.8854 12.2594 19.8854 12.5394V15.4019C19.8854 17.6421 19.8854 18.7622 19.4494 19.6179C19.066 20.3705 18.454 20.9825 17.7014 21.3659C16.8457 21.8019 15.7256 21.8019 13.4854 21.8019H9.51459C7.27437 21.8019 6.15427 21.8019 5.29862 21.3659C4.54597 20.9825 3.93405 20.3705 3.55056 19.6179C3.11458 18.7622 3.11458 17.6421 3.11458 15.4019V12.5394C3.11458 12.2594 3.11458 12.1194 3.16908 12.0124C3.21702 11.9183 3.29351 11.8419 3.38759 11.7939C3.49455 11.7394 3.63456 11.7394 3.91458 11.7394H10.2755L10.2858 11.7394C10.5584 11.7419 10.7788 11.9623 10.7812 12.2349Z"
              fill="#34D399"
            />
          </svg>
        ),
      },
    ],
  },
];

export default function Pricing() {
  return (
    <div className="py-40 bg-body-1 relative">
      <div className="mx-5 z-10">
        <div className="max-w-7xl mx-auto flex items-center flex-col overflow-hidden">
          <div className="bg-purple-2 bg-opacity-10 mb-10 text-purple-2 rounded-full py-4 px-8 font-medium">
            Pricing
          </div>

          <h2
            id="pricing"
            className="text-[32px] md:text-[40px] text-center leading-tight font-bold"
          >
            Pay once, get lifetime updates
          </h2>
          <p className="text-lg max-w-lg text-center">
            Enjoy lifetime updates to both the infographics and videos. New
            infographics and videos each week.
          </p>

          <img
            src={pricingComments}
            alt="pricing background comments"
            className="absolute -left-60 -top-20 w-1/2"
          />

          <span className="py-1 text-sm text-center md:text-lg px-4 mt-10 border-purple-500 border inline-flex items-center gap-x-1 font-medium bg-purple-100 text-purple-800 rounded-full dark:bg-purple-500/10 dark:text-purple-500">
            Join over 5300+ developers who already trusted this course
          </span>

          <ul className="grid grid-cols-1 lg:grid-cols-3 mt-10 gap-8 relative ">
            {Pricings.map((pricing, index) => {
              return (
                <li
                  key={index}
                  className={`max-w-[310px] sm:max-w-[271px] z-10 md:max-w-none rounded-[32px] bg-slate-800 border border-light-1 px-8 lg:!px-8 py-5 w-[332px] flex justify-between flex-col ${pricing.background}`}
                >
                  <div className=" flex justify-between flex-col mb-8 relative">
                    {index === 0 && (
                      <img
                        src={silverMedal}
                        alt="star trophy"
                        className="w-24 mb-5"
                      />
                    )}
                    {index === 2 && (
                      <img
                        src={goldMedal}
                        alt="star trophy"
                        className="w-24 mb-5"
                      />
                    )}
                    {index === 1 && (
                      <img
                        src={glassTrophy}
                        alt="star trophy"
                        className="w-24 mb-5"
                      />
                    )}
                    <h3 className=" text-[25px] font-bold mb-8 leading-tight">
                      {pricing.title}
                    </h3>
                    <div className="flex flex-col w-fit">
                      <p className="font-bold text-3xl">
                        {pricing.price}
                        <span className="ml-2 text-[22px] opacity-40 relative">
                          <span className="w-full rounded-full bg-white h-[3px] absolute bottom-3 -rotate-[170deg]" />
                          {pricing.fullPrice}
                        </span>{" "}
                      </p>
                      <div className="border-purple-2 border rounded-full text-center font-bold text-xs bg-purple-2 bg-opacity-10">
                        {index === 2 ? '30% OFF' : '50% OFF'}
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-white bg-opacity-10 my-5" />

                    <ul className="flex flex-col gap-4">
                      {pricing.content.map((item) => {
                        return (
                          <li
                            key={item.name}
                            className="flex items-start gap-2"
                          >
                            {item.icon}
                            <span className="flex-1">{item.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <Button
                    onClick={() => {
                      let pricingName = 0;
                      if (index === 0) {
                        pricingName = "Infographics";
                      } else if (index === 1) {
                        pricingName = "Video Course";
                      } else {
                        pricingName = "Videos & Infographics";
                      }
                      track("Get it now", { name: pricingName });
                      mixpanel.track("Click", {
                        "Get it now": pricingName,
                      });
                    }}
                    to={pricing.href}
                    primary
                    full
                  >
                    <span>Get it now</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
