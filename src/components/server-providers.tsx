import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import AuthProvider from "@/app/api/auth/[...nextauth]/auth-provider";
import QueryProvider from "@/state/react-query/query-provider";
import AuthBootstrap from "./AuthBootstrap";


export default async function ServerProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return <AuthProvider session={session}>
    <QueryProvider>
      <AuthBootstrap>
        {children}
      </AuthBootstrap>
    </QueryProvider>
  </AuthProvider>;
}
