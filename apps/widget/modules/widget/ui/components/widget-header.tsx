interface Props {
    children: React.ReactNode;
}

export const WidgetHeader = ({ children }: Props) => {
    return (
        <header className="flex items-center justify-between p-4">
            {children}
        </header>
    )
}