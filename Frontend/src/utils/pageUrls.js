import { CalendarIcon, ClientsIcon, DashboardIcon, UserIcon } from "./icons";

export const pageLinksArr = [
  {
    name: "Přehled",
    url: "/",
    icon: <DashboardIcon width="24" />,
  },
  {
    name: "Klienti",
    url: "/clients",
    icon: <ClientsIcon width="24" />,
  },
  {
    name: "Kalendář",
    url: "/calendar",
    icon: <CalendarIcon width="24" />,
  },
  {
    name: "Můj Profil",
    url: "/profile",
    icon: <UserIcon width="24" />,
  },
];
