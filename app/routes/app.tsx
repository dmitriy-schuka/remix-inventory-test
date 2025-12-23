import type {Route} from "./+types/home";
import {useNavigate} from "react-router";
import {useCallback} from "react";
import {Layout, Page, Button} from "@shopify/polaris";

export function meta({}: Route.MetaArgs) {
  return [
    {title: "Home Page"},
    {name: "description", content: "Welcome to the Inventory Test App!"},
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const onRedirectHandle = useCallback(() => navigate("/dashboard"), []);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Button onClick={onRedirectHandle}>
            Dashboard
          </Button>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
