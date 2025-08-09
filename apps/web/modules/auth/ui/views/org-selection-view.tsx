import { OrganizationList } from "@clerk/nextjs";

export const OrgSelectionView = () => {
  return <OrganizationList
  afterSelectOrganizationUrl="/"
  afterCreateOrganizationUrl="/"
  hidePersonal
  skipInvitationScreen
  />
}

export default OrgSelectionView
