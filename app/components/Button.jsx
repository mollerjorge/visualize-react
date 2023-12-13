import { Link } from "@remix-run/react";

const sparkles = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.00001 4.5C9.16297 4.50003 9.32149 4.55315 9.45158 4.6513C9.58167 4.74945 9.67625 4.8873 9.72101 5.044L10.534 7.89C10.7091 8.50292 11.0375 9.0611 11.4882 9.51183C11.9389 9.96255 12.4971 10.2909 13.11 10.466L15.956 11.279C16.1126 11.3239 16.2503 11.4185 16.3484 11.5486C16.4464 11.6786 16.4995 11.8371 16.4995 12C16.4995 12.1629 16.4464 12.3214 16.3484 12.4514C16.2503 12.5815 16.1126 12.6761 15.956 12.721L13.11 13.534C12.4971 13.7091 11.9389 14.0374 11.4882 14.4882C11.0375 14.9389 10.7091 15.4971 10.534 16.11L9.72101 18.956C9.67615 19.1126 9.58153 19.2503 9.45145 19.3484C9.32137 19.4464 9.1629 19.4995 9.00001 19.4995C8.83711 19.4995 8.67865 19.4464 8.54857 19.3484C8.41849 19.2503 8.32387 19.1126 8.27901 18.956L7.46601 16.11C7.29096 15.4971 6.96256 14.9389 6.51184 14.4882C6.06111 14.0374 5.50293 13.7091 4.89001 13.534L2.04401 12.721C1.88741 12.6761 1.74968 12.5815 1.65163 12.4514C1.55358 12.3214 1.50055 12.1629 1.50055 12C1.50055 11.8371 1.55358 11.6786 1.65163 11.5486C1.74968 11.4185 1.88741 11.3239 2.04401 11.279L4.89001 10.466C5.50293 10.2909 6.06111 9.96255 6.51184 9.51183C6.96256 9.0611 7.29096 8.50292 7.46601 7.89L8.27901 5.044C8.32377 4.8873 8.41835 4.74945 8.54844 4.6513C8.67853 4.55315 8.83705 4.50003 9.00001 4.5ZM18 1.5C18.1673 1.49991 18.3299 1.55576 18.4618 1.65869C18.5937 1.76161 18.6874 1.90569 18.728 2.068L18.986 3.104C19.222 4.044 19.956 4.778 20.896 5.014L21.932 5.272C22.0946 5.31228 22.2391 5.40586 22.3423 5.5378C22.4456 5.66974 22.5017 5.83246 22.5017 6C22.5017 6.16754 22.4456 6.33026 22.3423 6.4622C22.2391 6.59414 22.0946 6.68772 21.932 6.728L20.896 6.986C19.956 7.222 19.222 7.956 18.986 8.896L18.728 9.932C18.6877 10.0946 18.5942 10.2391 18.4622 10.3423C18.3303 10.4456 18.1675 10.5017 18 10.5017C17.8325 10.5017 17.6698 10.4456 17.5378 10.3423C17.4059 10.2391 17.3123 10.0946 17.272 9.932L17.014 8.896C16.8986 8.43443 16.66 8.0129 16.3235 7.67648C15.9871 7.34005 15.5656 7.10139 15.104 6.986L14.068 6.728C13.9054 6.68772 13.7609 6.59414 13.6577 6.4622C13.5544 6.33026 13.4983 6.16754 13.4983 6C13.4983 5.83246 13.5544 5.66974 13.6577 5.5378C13.7609 5.40586 13.9054 5.31228 14.068 5.272L15.104 5.014C15.5656 4.89861 15.9871 4.65995 16.3235 4.32352C16.66 3.9871 16.8986 3.56557 17.014 3.104L17.272 2.068C17.3126 1.90569 17.4063 1.76161 17.5382 1.65869C17.6702 1.55576 17.8327 1.49991 18 1.5ZM16.5 15C16.6575 14.9999 16.8111 15.0494 16.9389 15.1415C17.0667 15.2336 17.1622 15.3636 17.212 15.513L17.606 16.696C17.756 17.143 18.106 17.495 18.554 17.644L19.737 18.039C19.886 18.089 20.0155 18.1845 20.1072 18.3121C20.199 18.4397 20.2483 18.5929 20.2483 18.75C20.2483 18.9071 20.199 19.0603 20.1072 19.1879C20.0155 19.3155 19.886 19.411 19.737 19.461L18.554 19.856C18.107 20.006 17.755 20.356 17.606 20.804L17.211 21.987C17.161 22.136 17.0655 22.2655 16.9379 22.3572C16.8103 22.4489 16.6571 22.4983 16.5 22.4983C16.3429 22.4983 16.1897 22.4489 16.0621 22.3572C15.9346 22.2655 15.839 22.136 15.789 21.987L15.394 20.804C15.3203 20.5833 15.1963 20.3827 15.0318 20.2182C14.8673 20.0537 14.6667 19.9297 14.446 19.856L13.263 19.461C13.114 19.411 12.9845 19.3155 12.8928 19.1879C12.8011 19.0603 12.7517 18.9071 12.7517 18.75C12.7517 18.5929 12.8011 18.4397 12.8928 18.3121C12.9845 18.1845 13.114 18.089 13.263 18.039L14.446 17.644C14.893 17.494 15.245 17.144 15.394 16.696L15.789 15.513C15.8387 15.3637 15.9341 15.2339 16.0617 15.1418C16.1893 15.0497 16.3427 15.0001 16.5 15Z"
      fill="white"
    />
  </svg>
);

export default function Button({
  children,
  primary,
  full,
  to,
  onClick,
  cn = "",
  href = "",
}) {
  let className =
    "bg-purple-1 rounded-full hover:-translate-y-1 cursor-pointer transform !border-0 focus:!outline-none !outline-none transition-all text-lg font-bold px-8 flex items-center gap-2 py-4";

  if (full) {
    className += " w-full justify-center";
  }
  if (href) {
    return (
      <a
        target="_blank"
        href={href}
        onClick={onClick}
        className={`${className} ${cn} !transition-none !translate-y-0`}
        rel="noreferrer"
      >
        {primary && sparkles}
        {children}
      </a>
    );
  }
  return (
    <Link onClick={onClick} to={to} className={`${className} ${cn}`}>
      {primary && sparkles}
      {children}
    </Link>
  );
}
