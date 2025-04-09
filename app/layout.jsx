import { Roboto_Flex, Poppins } from "next/font/google";
import "./globals.css";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  weight: "variable",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "KawAikoLink",
  description: "thanks r/feminineboys",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${robotoFlex.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
