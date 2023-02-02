import type { FieldAccess } from 'payload/types'
import { User, Product } from '../../../payload-types'

// we need to prevent access to documents behind a paywall
// to do this we check the document against the user's list of active purchases
export const checkUserPurchases: FieldAccess<Product> = async ({ req: { user, payload }, doc }) => {
  if (!user) {
    return false
  }

  if (doc) {
    const fullUser: User = await payload.findByID({
      collection: 'users',
      id: typeof user === 'object' ? user.id : user,
    })

    if (fullUser && typeof fullUser === 'object' && fullUser?.purchases?.length > 0) {
      return fullUser.purchases?.some((purchase) => doc.id === (typeof purchase === 'object' ? purchase.id : purchase))
    }
  }

  return true
}