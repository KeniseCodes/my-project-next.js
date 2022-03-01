const domain = "https://mockfolio-1.myshopify.com/"
const storefrontAccessToken = 'fe2cbc014984324831462dce78d3c9a1'

async function ShopifyData(query) {
  const URL = 'https://$(domain)/api/2022-01/graphql.json'

  const options = {
    endpoint: URL,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query })
  }

  try {
    const data = await fetch(URL, options).then(response => {
    return response.json()
  })

  return data
  } catch (error) {
   // throw new Error("Products not fetched")
  }
}

export async function getProductsInCollection() {
  const query =  
  `{
    collectionByHandle(handle: "frontpage") {
      title
      products(first: 25) {
        edges {
          node{
            id
            title
            images(first: 5) {
              edges {
                node {
                 url
                 altText
                }
              }
            }
          }
        }
      }
    }
  }`

  const response = await ShopifyData(query)
  const allProducts = response.data.collectionByHandle.products.edges ? response.data.collectionByHandle.products.edges : []

  return allProducts

}

export async function getProduct(handle) {
  const query = 
  `{
    productByHandle(handle: "${handle}") {
    	collections(first: 1) {
      	edges {
          node {
            products(first: 5) {
              edges {
                node {
                  priceRange {
                    minVariantPrice {
                      amount
                    }
                  }
                  handle
                  title
                  id
                  totalInventory
                  images(first: 5) {
                    edges {
                      node {
                        originalSrc
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
    	}
      id
      title
      handle
      description
      images(first: 5) {
        edges {
          node {
            originalSrc
            altText
          }
        }
      }
      options {
        name
        values
        id
      }
      variants(first: 25) {
        edges {
          node {
            selectedOptions {
              name
              value
            }
            image {
              originalSrc
              altText
            }
            title
            id
            availableForSale
            priceV2 {
              amount
            }
          }
        }
      }
    }
  }`

  const response = await ShopifyData(query)

  const product = response.data.productByHandle ? response.data.productByHandle : []

  return product
}

