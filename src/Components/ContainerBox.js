import "../App.css";

export default function ContainerBox({
    titleCaption,
    childContent,
    useActionContainer,
    useBackButton,
    backButtonChild,
    actionContainerChild,
    captionSize = "large",
    containerPos = "outer"
}) {
    return (
        <div className={containerPos === "outer" ? "master-table-container-outer" : "master-table-container-inner"}>
            <div className="master-table-title-header">
                {useBackButton && <div className="master-table-title-action-container">
                    {backButtonChild}
                </div>}
                <div className="master-table-title-caption-container">
                    <div className={captionSize === "large" ? "master-table-title-caption" : "master-table-title-caption-small"}>{titleCaption}</div>
                </div>
                {useActionContainer && <div className="master-table-title-action-container">
                    {actionContainerChild}
                </div>}
            </div>
            {childContent}
        </div>
    )
};