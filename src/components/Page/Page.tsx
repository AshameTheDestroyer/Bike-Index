import React from "react";

import "./Page.scss";

type PageProps = WithRequired<ComponentProps, "id">;

export default function Page(props: PageProps): React.ReactElement {
    return <main {...props} className={["page", props.className].toClassName()} />;
}