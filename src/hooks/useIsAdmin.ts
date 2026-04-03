import { OWNER_PUBKEY } from '@/lib/adminConfig';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAdminConfig } from '@/hooks/useAdminConfig';

interface AdminStatus {
  isOwner: boolean;
  isAdmin: boolean;
  pubkey: string | undefined;
  isLoading: boolean;
}

/**
 * Returns the admin status of the currently logged-in user.
 *
 * isOwner — only nostrdanish (OWNER_PUBKEY). Can add/remove admins.
 * isAdmin — owner + any pubkey listed in the on-chain admins config.
 */
export function useIsAdmin(): AdminStatus {
  const { user } = useCurrentUser();
  const { data: config, isLoading } = useAdminConfig();

  const pubkey = user?.pubkey;
  const isOwner = pubkey === OWNER_PUBKEY;
  const isAdmin = isOwner || (!!pubkey && (config?.admins ?? []).includes(pubkey));

  return { isOwner, isAdmin, pubkey, isLoading };
}
