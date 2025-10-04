import { RefreshCcw } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useFetcher } from 'react-router';
import { Button } from "~/components/ui/button";

export type InvitationBlockProps = {
    invitation: {
        id:string;
        email:string;
        expired:boolean;
        sentDate: string;
        sentBy: string;
        status:string;
    };
}
const InvitationBlock:React.FC<InvitationBlockProps> = ({invitation}) => {

    let {t} = useTranslation()
    let fetcher = useFetcher()

    const onReSendClick = () => {
        fetcher.submit({ id: invitation.id }, { method: "post" });
    }

    return (
        <div key={invitation.id} className="border rounded-lg p-4 space-y-3 bg-muted dark:bg-gray-800">
            <input name='id' defaultValue={invitation.id} hidden />
            <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 space-y-2">
                <p className="font-medium text-lg break-all">{invitation.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                {t("sent_at")}: <span className='text-lg text-main dark:text-white'>{invitation.sentDate?.toLocaleString()}</span>
                </p>
                <p className="text-md text-muted-foreground">
                {t("sent_by")}: <span className='text-lg text-main dark:text-white'>{invitation.sentBy}</span>
                </p>
            </div>
            {invitation.status == 'Accepted' ?
                <span className='bg-success p-2 rounded-full text-white text-xs'>
                    {t("accepted")}
                </span>
            :
                invitation.status !== 'Accepted' &&
                    invitation.expired ?
                        <div className='flex flex-col items-center space-y-2'>
                            <span className='w-full text-center bg-destructive p-2 rounded-full text-white text-xs'>
                                {t("expired")}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onReSendClick}
                                className="border-main hover:border-orange rounded-full max-w-[250px] w-full flex items-center justify-center gap-2"
                            >
                                <RefreshCcw className={`h-3.5 w-3.5`} />
                                {t("resend")}
                            </Button>
                        </div>
                    :
                        <span className='bg-ring p-2 rounded-full text-white text-xs'>
                            {t("pending")}
                        </span>
            }
            </div>
        </div>
    )
}

export default InvitationBlock;