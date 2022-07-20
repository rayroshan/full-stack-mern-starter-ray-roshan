import Head from "next/head";
import React from "react";
import { Container } from "reactstrap";
import { useRouter } from "next/router";
import Navigation from "@/components/navigation/Navigation";

const BasePage = (props) => {
  const router = useRouter();
  const {
    indexPage,
    className = "",
    header,
    title,
    metaDescription,
    canonicalPath,
    children,
    user,
  } = props;

  const pageType = indexPage ? "index-page" : "base-page";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" key="description" content={metaDescription} />
        <meta name="title" key="title" content={title} />
        <meta property="og:title" key="og:title" content={title} />
        <meta property="og:locale" key="og:locale" content="en_EU" />
        <meta
          property="og:url"
          key="og:url"
          content={`${process.env.BASE_URL}${router.asPath}`}
        />
        <meta property="og:type" key="og:type" content="website" />
        <meta
          property="og:description"
          key="og:description"
          content={metaDescription}
        />
        <meta
          property="og:image"
          key="og:image"
          content={`${process.env.BASE_URL}/images/section-1.png`}
        />
        <link
          rel="stylesheet"
          href="https://use.typekit.net/uku0lnk.css"
        ></link>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
        <link
          rel="canonical"
          href={`${process.env.BASE_URL}${
            canonicalPath ? canonicalPath : router.asPath
          }`}
        />
      </Head>
      <div className={`${pageType} ${className}`}>
        {header && <Navigation user={user} />}
        <Container fluid>{children}</Container>
      </div>
    </>
  );
};

export default BasePage;
