import { toast, ToasterProps, ToastClassnames, ToastT } from 'sonner'

export function actionToast({
    actionData,
}: {
    actionData: {
        error: boolean
        message: string
    }
}) {

    if(actionData.error){
        return toast.error(actionData.message)
    }

    return toast.success(actionData.message)
}
