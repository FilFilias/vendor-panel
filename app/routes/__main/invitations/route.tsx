import { ActionFunctionArgs, data, Link, LoaderFunction, useLoaderData } from "react-router";
import { sessionStorage } from "~/lib/medusa-session";
import { getVendorsInvitations } from "~/providers/vendor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Mail } from "lucide-react";
import InvitationsList from "~/components/invitations/InvitationsList";
import { PaginationComp } from "~/components/pagination/PaginationComp";
import { useTranslation } from "react-i18next";
import { sdk } from "~/lib/config";
import { LinkButton } from "~/components/ui/buttoLink";

export async function action({
    request,
  }: ActionFunctionArgs) {
  const body = await request.formData();

  let { _action, id } = Object.fromEntries(body)

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))

  switch (_action) {
    case "refresh-invitation": {
      try {
          let inviteRefreshvendor = await sdk.client.fetch('/vendor/invitation/refresh',{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${session.data['connect.sid']}`
              },
              body: {
                "invite_id": id
              },
            })
          return data({inviteRefreshvendor,success:true});
      } catch (error) {
          console.error(error)
          return data({error:error})
      }
    }
    case "delete-invitation": {
      try {
        let inviteDelete = await sdk.client.fetch(`/vendor/invitation/delete/${id}`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${session.data['connect.sid']}`
          }
        })
        return data({inviteDelete,success:true});
      } catch (error) {
          console.error(error)
          return data({error:error})
      }
    }
    default:
      return data({ error: "Unknown action" }, { status: 400 });
  }  
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const urlSearchParams = Object.fromEntries(url.searchParams.entries());
  
    let page = urlSearchParams.page ?? 1
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))
    let {result,count,take,skip} = await getVendorsInvitations(session.data["connect.sid"] as string,parseInt(page));
    console.log(result)
    let invitations = result?.map( inv => ({
        id: inv.invite.id,
        email: inv.invite?.email,
        status: inv.invite.accepted ? "Accepted" : "Pending",
        sentDate: new Date(inv.invite.created_at),
        sentBy: inv.invite?.vendor_admin?.email,
        expired: new Date(inv.invite.expires_at) < new Date(), // Check if expired

    }))
    
    const totalPages = Math.ceil(count / take);
    const currentPage = Math.floor(skip / take) + 1;    
    const total = count
    return data({invitations,count,totalPages,currentPage,total})
};

export default function InvitationsListPage () {

    let {invitations,currentPage,totalPages} = useLoaderData()
    let {t} = useTranslation()

    return (
        <Card className="dark:bg-gray-800 dark:text-white pt-8">
          <CardHeader >
            <div className="flex justify-between items-end flex-wrap gap-y-4">
              <div >
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t("pending_invitations")}</h1>
                </CardTitle>
                <CardDescription>
                  {t("pending_invitations_desc")}
                </CardDescription>
              </div>
              <LinkButton
                variant="secondary"
                to='/invite-customer'
                className="flex items-center gap-1"
              >
                <Mail className="h-4 w-4" />
                <span>{t("customer_invite")}</span>
              </LinkButton>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            {invitations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("no_pending_invitations")}</p>
              </div>
            ) : 
            <>
                <InvitationsList invitations={invitations} />
                <div className="flex justify-center pt-4">
                    <PaginationComp
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl="/invitations"
                    />
                </div>

            </>
            }
          </CardContent>
        </Card>
    )
}