import { ActionFunctionArgs, data, type LoaderFunction, type MetaFunction } from "react-router";
import { UsersList } from "~/components/settings/UsersList";
import { sdk } from "~/lib/config";
import { sessionStorage } from "~/lib/medusa-session";
import { getVendorAdmins } from "~/providers/vendor";

export const action = async ({
  request,
}: ActionFunctionArgs) => {
  const body = await request.formData();

  switch (request.method) {
    case "DELETE": {
      let session = await sessionStorage.getSession(request.headers.get("Cookie"))

      let { vendorAdminID } = Object.fromEntries(body)
      let deleteVendor = await sdk.client.fetch(`/vendor/admin/delete/${vendorAdminID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${session.data['connect.sid']}`
        }
      });
      return data({success: true})
    }
  }
};


export const loader: LoaderFunction = async ({ request, params }) => {

  let session = await sessionStorage.getSession(request.headers.get("Cookie"))
  let users = await getVendorAdmins(session.data["connect.sid"] as string);
  
  return data(users)
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function UsersListPage() {
  return (       
    <UsersList />
  );
}