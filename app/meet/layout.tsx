import Nav from "@/components/Nav";
import SessionWrapper from "@/components/SessionWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function MeetLayout({ children }) {
  // Fetch the session server-side
  const session = await getServerSession(authOptions);

  console.log("Session fetched in MeetLayout:", session); // Log session for debugging

  return (
    <>
      <SessionWrapper session={session}>
        <Nav />
        {children}
      </SessionWrapper>
    </>
  );
}
