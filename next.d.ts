import type { ReactElement, ReactNode } from 'react';
import type {
  NextComponentType,
  NextPageContext,
} from 'next/dist/shared/lib/utils';
import { Role } from './types';

declare module 'next' {
  export declare type NextPage<P = {}, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P
  > & {
    authGuard?: boolean;
    guestGuard?: boolean;
    acl: Role;
  };
}
