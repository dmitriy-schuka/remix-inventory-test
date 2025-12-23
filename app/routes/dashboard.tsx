import {Suspense} from "react";
import {useLoaderData, useFetcher, useRouteError, Await} from "react-router";
import {getInventory, claimStock} from "../models/inventory.server";
import {Box, Card, Text, Layout, Page, Spinner, Banner, Button, BlockStack} from "@shopify/polaris";
import type {LoaderFunction, ActionFunction} from "react-router";

export const loader: LoaderFunction = async () => {
  try {
    return ({
      inventoryPromise: getInventory(),
    });
  } catch (err) {
    throw new Error("Failed to load inventory.");
  }
};

export const action: ActionFunction = async ({request}: { request: Request }) => {
  const formData = await request.formData();
  const itemId = formData.get("itemId");

  if (!itemId || typeof itemId !== "string") {
    throw new Error("Invalid item ID");
  }

  try {
    const updatedItem = await claimStock(itemId);
    return {updatedItem};
  } catch (error) {
    return {error: error.message || "Failed to claim stock"};
  }
};

export default function Dashboard() {
  const { inventoryPromise } = useLoaderData();
  const fetcher = useFetcher();

  return (
    <Page title="Inventory Dashboard">
      <Suspense fallback={<Spinner />}>
        <Await resolve={inventoryPromise}>
          {(inventory) => (
            <Layout>
              <Layout.Section>
                {inventory?.map((item) => (
                  <Card key={item.id} title={item.name} sectioned>
                    <Text variant="bodyMd" as="p">
                      Stock: {item.stock}
                    </Text>
                    <fetcher.Form method="post">
                      <input type="hidden" name="itemId" value={item.id} />
                      <Button
                        submit
                        disabled={
                          fetcher.state === "submitting" &&
                          fetcher.formData?.get("itemId") === item.id
                        }
                      >
                        Claim One
                      </Button>
                    </fetcher.Form>
                  </Card>
                ))}
              </Layout.Section>
            </Layout>
          )}
        </Await>
      </Suspense>
    </Page>
  );
}

// Route-Level Error Boundary
export function ErrorBoundary() {
  const error = useRouteError(); // Get an error at the route level
  const fetcher = useFetcher();

  const handleRetry = () => {
    fetcher.load("/dashboard"); // Recall loader
  };

  const isLoading = fetcher.state === "loading";

  return (
    <Page title="Inventory Dashboard">
      <Layout>
        <Layout.Section>
          <Banner title="Error loading inventory" tone="critical">
            <BlockStack gap="400" align={"start"}>
              <Text variant="bodyMd" as="p">{error.message}</Text>
              <Box>
                <Button onClick={handleRetry} disabled={isLoading} size={"micro"}>Retry</Button>
              </Box>
            </BlockStack>
          </Banner>
        </Layout.Section>
      </Layout>
    </Page>
  );
}