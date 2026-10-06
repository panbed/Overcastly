import PictureSettingsForm from "@/components/PictureSettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UpdatePassword from "@/components/UpdatePassword";
import UserSettingsForm from "@/components/UserSettingsForm";

export default function SettingsPage() {


  return (
    <div className="p-3 md:flex align-middle justify-center md:p-5 gap-3">
      <Card className="md:w-1/2 xl:w-1/4">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Update your profile here.</CardDescription>
        </CardHeader>

        <CardContent>
          <UserSettingsForm />
        </CardContent>
      </Card>

      <Card className="md:w-1/2 xl:w-1/4">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile picture here.</CardDescription>
        </CardHeader>

        <CardContent>
          <PictureSettingsForm />
        </CardContent>
      </Card>

      <Card className="md:w-1/2 xl:w-1/4">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password here.</CardDescription>
        </CardHeader>

        <CardContent>
          <UpdatePassword />
        </CardContent>
      </Card>
    </div>
  )
}