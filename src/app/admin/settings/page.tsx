// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { User, Mail, Lock, Save, Trash2, Loader2 } from "lucide-react";
// import useDashboardAdminSettingsData from "@/hooks/use-dashboardAdminSettings";
// import { useToast } from "@/hooks/use-toast";

// export default function AccountSettingsPage() {
//   const { data: session } = useSession();
//   const { toast } = useToast();
//   const [saving, setSaving] = useState(false);

//   const [profileImage, setProfileImage] = useState<string>("");
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     country: "",
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // Fetch profile with custom hook
//   const { userProfileData, updateUserProfileMutation, changePasswordMutation } =
//     useDashboardAdminSettingsData();
//   const { data: profile, isLoading, refetch } = userProfileData;

//   useEffect(() => {
//     if (profile) {
//       setFormData({
//         fullName: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
//         email: profile.email || "",
//         phoneNumber: profile.phone_number || "",
//         country: profile.country || "us",
//       });
//       setProfileImage(profile.profile_picture || "");
//     }
//   }, [profile]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setProfileImage("");
//   };

//   const handleSaveAccountDetails = async () => {
//     if (!session?.user?.accessToken) return;

//     const [firstName, ...lastNameParts] = formData.fullName.split(" ");
//     const lastName = lastNameParts.join(" ");

//   //   setSaving(true);
//   //   try {
//   //     await updateUserProfileMutation.mutateAsync({
//   //       first_name: firstName,
//   //       last_name: lastName,
//   //       email: formData.email,
//   //       phone_number: formData.phoneNumber,
//   //       country: formData.country,
//   //       profile_picture: profileImage,
//   //     });
//   //     toast({
//   //       title: "Success",
//   //       description: "Profile updated successfully!",
//   //     });
//   //     refetch();
//   //   } catch (error) {
//   //     console.error("Error updating profile:", error);
//   //     toast({
//   //       title: "Error",
//   //       description: "Failed to update profile.",
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setSaving(false);
//   //   }
//   // };

//   // const handleSavePassword = async () => {
//   //   if (!session?.user?.accessToken) return;
//   //   if (passwordData.newPassword !== passwordData.confirmPassword) {
//   //     toast({
//   //       title: "Error",
//   //       description: "New passwords do not match.",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   setSaving(true);
//   //   try {
//   //     await changePasswordMutation.mutateAsync({
//   //       current_password: passwordData.currentPassword,
//   //       new_password: passwordData.newPassword,
//   //       new_password_confirmation: passwordData.confirmPassword,
//   //     });
//   //     toast({
//   //       title: "Success",
//   //       description: "Password changed successfully!",
//   //     });
//   //     setPasswordData({
//   //       currentPassword: "",
//   //       newPassword: "",
//   //       confirmPassword: "",
//   //     });
//   //   } catch (error) {
//   //     console.error("Error changing password:", error);
//   //     toast({
//   //       title: "Error",
//   //       description:
//   //         "Failed to change password. Please check your current password.",
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setSaving(false);
//   //   }
//   // };

//   const passwordRequirements = [
//     {
//       text: "At least 10 characters (and up to 100 characters)",
//       met: passwordData.newPassword.length >= 10,
//     },
//     {
//       text: "At least one lowercase character",
//       met: /[a-z]/.test(passwordData.newPassword),
//     },
//     {
//       text: "Inclusion of at least one special character, e.g., ! @ # ?",
//       met: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword),
//     },
//     {
//       text: "Significantly different from your previous passwords",
//       met: passwordData.newPassword.length > 0,
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 px-3 space-y-6 max-w-full overflow-hidden">
//       <div>
//         <p className="text-sm text-gray-500 mb-1">
//           Home &gt; Profile &gt; Account Settings
//         </p>
//         <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
//       </div>

//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <div className="flex items-center gap-2 mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">
//             Account details
//           </h2>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <Label className="text-sm font-medium text-gray-900 block mb-2">
//               Upload profile picture
//             </Label>
//             <div className="flex items-center gap-4">
//               <div className="relative w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
//                 {profileImage ? (
//                   <Image
//                     src={profileImage}
//                     alt="Profile"
//                     fill
//                     className="object-cover"
//                   />
//                 ) : (
//                   <User className="h-8 w-8 text-gray-400" />
//                 )}
//               </div>

//               <div className="flex-1">
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="file"
//                     id="profile-upload"
//                     accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
//                     onChange={handleImageUpload}
//                     className="sr-only"
//                   />
//                   <label
//                     htmlFor="profile-upload"
//                     className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
//                   >
//                     Choose files
//                   </label>
//                   <span className="text-sm text-gray-500">
//                     {profileImage ? "Image selected" : "No file chosen"}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">
//                   SVG, PNG, JPG or GIF (MAX. 800x400px).
//                 </p>
//               </div>
//             </div>
//             {profileImage && (
//               <button
//                 onClick={handleRemoveImage}
//                 className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 mt-3"
//               >
//                 <Trash2 className="h-4 w-4" />
//                 Remove profile picture
//               </button>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <Label htmlFor="full-name">
//                 Full name <span className="text-red-500">*</span>
//               </Label>
//               <div className="relative mt-1">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="full-name"
//                   placeholder="e.g. Bonnie Green"
//                   value={formData.fullName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, fullName: e.target.value })
//                   }
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="email">
//                   Email address <span className="text-red-500">*</span>
//                 </Label>
//               </div>
//               <div className="relative mt-1">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="e.g. name@company.com"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <Label htmlFor="phone-number">
//                 Phone number <span className="text-red-500">*</span>
//               </Label>
//               <div className="flex gap-2 mt-1">
//                 <Select defaultValue="+12">
//                   <SelectTrigger className="w-[100px]">
//                     <div className="flex items-center gap-2">
//                       <span>🇺🇸</span>
//                       <span>+12</span>
//                     </div>
//                   </SelectTrigger>
//                 </Select>
//                 <Input
//                   id="phone-number"
//                   placeholder="+1 123 456 7890"
//                   value={formData.phoneNumber}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phoneNumber: e.target.value })
//                   }
//                   className="flex-1"
//                 />
//               </div>
//             </div>
//             <div>
//               <Label htmlFor="country">Country</Label>
//               <Select
//                 value={formData.country}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, country: value })
//                 }
//               >
//                 <SelectTrigger className="mt-1">
//                   <SelectValue placeholder="🌍 United States" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="us">🇺🇸 United States</SelectItem>
//                   <SelectItem value="ae">🇦🇪 United Arab Emirates</SelectItem>
//                   <SelectItem value="eg">🇪🇬 Egypt</SelectItem>
//                   <SelectItem value="sa">🇸🇦 Saudi Arabia</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div>
//             <Button
//               onClick={handleSaveAccountDetails}
//               disabled={saving}
//               className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
//             >
//               <Save className="h-4 w-4" />
//               {saving ? "Saving..." : "Save changes"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <div className="flex items-center gap-2 mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">Password</h2>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-5">
//             <div>
//               <Label htmlFor="current-password">
//                 Enter your current password{" "}
//                 <span className="text-red-500">*</span>
//               </Label>
//               <div className="relative mt-1">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="current-password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={passwordData.currentPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       currentPassword: e.target.value,
//                     })
//                   }
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="new-password">
//                 You new password <span className="text-red-500">*</span>
//               </Label>
//               <div className="relative mt-1">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="new-password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={passwordData.newPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       newPassword: e.target.value,
//                     })
//                   }
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="confirm-password">
//                 Confirm new password <span className="text-red-500">*</span>
//               </Label>
//               <div className="relative mt-1">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="confirm-password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={passwordData.confirmPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       confirmPassword: e.target.value,
//                     })
//                   }
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 mb-2">
//               Password requirements:
//             </h3>
//             <p className="text-xs text-gray-500 mb-3">
//               Ensure that these requirements are met:
//             </p>
//             <ul className="space-y-2">
//               {passwordRequirements.map((req, index) => (
//                 <li key={index} className="flex items-start gap-2">
//                   <span
//                     className={`mt-0.5 ${
//                       req.met ? "text-green-500" : "text-gray-400"
//                     }`}
//                   >
//                     {req.met ? "✓" : "○"}
//                   </span>
//                   <span
//                     className={`text-xs ${
//                       req.met ? "text-gray-900" : "text-gray-500"
//                     }`}
//                   >
//                     {req.text}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div className="mt-6">
//           <Button
//             onClick={handleSavePassword}
//             disabled={saving}
//             className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
//           >
//             <Save className="h-4 w-4" />
//             {saving ? "Saving..." : "Save changes"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function Page() {
  return <div>page</div>;
}
