import { Payload } from 'payload';
import path from 'path';
import { home } from './home';
import { shopPage } from './shop-page';
import { product1 } from './product-1';
import { shirtImage } from './shirt-image';
import { product4 } from './product-2';
import { product6 } from './product-3';
import { cartPage } from './cart-page';

export const seed = async (payload: Payload) => {
  await payload.create({
    collection: 'users',
    data: {
      email: 'dev@payloadcms.com',
      password: 'test',
      roles: ['admin']
    }
  });

  const [
    shirtDoc,
  ] = await Promise.all([
    payload.create({
      collection: 'media',
      filePath: path.resolve(__dirname, 'shirts.jpg'),
      data: shirtImage
    }),
  ])

  const [
    clothingCategory,
    ebookCategory,
    membersCategory,
  ]= await Promise.all([
    payload.create({
      collection: 'categories',
      data: {
        title: 'Clothing'
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'E-Book'
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Members'
      },
    })
  ]);

  Promise.all([
    payload.create({
      collection: 'products',
      data: JSON.parse(JSON.stringify({...product1, categories: [clothingCategory.id]})
        .replace(/{{SHIRTS_IMAGE}}/g, shirtDoc.id)),
    }),
    payload.create({
      collection: 'products',
      data: JSON.parse(JSON.stringify({...product4, categories: [ebookCategory.id]})),
    }),
    payload.create({
      collection: 'products',
      data: JSON.parse(JSON.stringify({...product6, categories: [membersCategory.id]})),
    })
  ]);

  const shopPageJSON = JSON.parse(JSON.stringify(shopPage)
    .replace(/{{SHIRTS_IMAGE}}/g, shirtDoc.id)
  );

  const { id: shopPageID } = await payload.create({
    collection: 'pages',
    data: shopPageJSON,
  })

  await payload.create({
    collection: 'pages',
    data: JSON.parse(JSON.stringify(home)
      .replace(/{{SHIRTS_IMAGE}}/g, shirtDoc.id)
      .replace(/{{SHOP_PAGE_ID}}/g, shopPageID),
    )
  })

  await payload.updateGlobal({
    slug: 'cart-page',
    data: JSON.parse(JSON.stringify(cartPage)
      .replace(/{{SHOP_PAGE_ID}}/g, shopPageID),
    )
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: shopPageID
            },
            label: 'Shop',
          }
        }
      ]
    }
  })
}