import { toast, ToastT } from 'sonner'

export function actionToast({
    actionData,
    ...props
}: Partial<Omit<ToastT, 'description'>> & {
    actionData: { error: boolean; message: string }
}) {
    if (actionData.error) {
        return toast.error('Error', {
            ...props,
            description: actionData.message,
        })
    }

    return toast.success('Success', {
        ...props,
        description: actionData.message,
    })
}
