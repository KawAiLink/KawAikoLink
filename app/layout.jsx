// RootLayout - app/layout.tsx
import { Roboto_Flex, Poppins } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path to your auth config
import SessionWrapper from "@/components/SessionWrapper";

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

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions); // Fetch session on server side

  return (
    <html lang="en">
      <body className={`${robotoFlex.className} antialiased`}>
        <SessionWrapper session={session}>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
