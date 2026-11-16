import PageNotFound from "@/components/views/404/PageNotFound";

export const metadata = {
  title: "404 - Page Not Found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <PageNotFound />;
}
