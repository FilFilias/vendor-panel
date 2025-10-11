import React from 'react'
import InvitationBlock, { InvitationType } from './InvitationBlock';

export type InvitationsListProps = {
    invitations: InvitationType[];
}

const InvitationsList:React.FC<InvitationsListProps> = ({invitations}) => {
    return (
        <div className="block pace-y-4 p-4 space-y-4">
            {invitations.map((invitation) => (
                <div key={invitation.id}>
                    <InvitationBlock invitation={invitation}  />
                </div>
            ))}
        </div>
    )
}

export default InvitationsList;