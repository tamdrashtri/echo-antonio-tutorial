import {atom} from "jotai";
import { WidgetScreen } from "@/modules/widget/types";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { CONTACT_SESSION_KEY } from "@/modules/widget/constants";
import { Id } from "@workspace/backend/_generated/dataModel";

// Basic widget state atoms
export const screenAtom = atom<WidgetScreen>("loading");

export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null);

export const contactSessionIdAtomFamily = atomFamily((organizationId: string) =>
  atomWithStorage<Id<"contactSessions"> | null>(`${CONTACT_SESSION_KEY}-${organizationId}`, null)
);

export const contactSessionIdAtom = contactSessionIdAtomFamily("default");

// Organization ID atom for the current widget instance
export const organizationIdAtom = atom<string | null>(null);