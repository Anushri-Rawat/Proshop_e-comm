import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keyword }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keyword} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to Proshop",
  description: "We sell best electronics for the cheapest price",
  keyword: "elects,buy electroniics,cheap electronics",
};

export default Meta;
