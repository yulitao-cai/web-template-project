import React, { useState, Fragment } from "react";
import { Query, withApollo } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";

import { useQuery } from "@apollo/react-hooks";

import { Spin, Select } from "antd";

import { Form } from "snowy/pro";

import { Link } from "react-router";
import query from "./query";

import gql from "graphql-tag";

const GetImageCatalogOptions = gql`
  query GetImageCatalogOptions($path: String!) {
    getImageCatalogOptions(path: $path) {
      items {
        name
        additionalName
      }
    }
  }
`;

const { Field, FieldArray } = Form;

export default withApollo(withRouter(JohnTest));

function JohnTest({ client }) {
  const style = { width: 260, marginRight: 10 };

  const [currentCategory, setCurrentCategory] = useState("");
  const [currentSys, setCurrentSys] = useState("");
  const [currentSubSys, setCurrentSubSys] = useState("");

  const { loading, error, data } = useQuery(GetImageCatalogOptions, {
    variables: { path: "/" },
    client,
  });

  const querySys = useQuery(GetImageCatalogOptions, {
    variables: { path: "/" + currentCategory },
    client,
    skip: !currentCategory,
  });

  const querySubsys = useQuery(GetImageCatalogOptions, {
    client,
    variables: { path: "/" + currentCategory + "/" + currentSys },
    skip: !currentCategory || !currentSys,
  });

  if (loading || error) {
    return <Spin />;
  }

  function genSys() {
    if (!currentCategory || querySys.loading || querySys.error) {
      return <Select key="10" style={style} loading></Select>;
    }

    const itemArr = _.get(querySys.data, "getImageCatalogOptions.items", []);
    if (itemArr.length && !currentSys) {
      setCurrentSys(itemArr[0].name);
    }

    return (
      <Select
        key="11"
        style={style}
        value={currentSys}
        onChange={(value) => {
          setCurrentSys(value);
          setCurrentSubSys("");
        }}
      >
        {itemArr.map((item) => {
          return <Select.Option value={item.name}>{item.name}</Select.Option>;
        })}
      </Select>
    );
  }

  function genSubsys() {
    if (
      !currentCategory ||
      !currentSys ||
      querySubsys.loading ||
      querySubsys.error
    ) {
      return <Select key="20" style={style} loading></Select>;
    }

    const itemArr = _.get(querySubsys.data, "getImageCatalogOptions.items", []);
    if (itemArr.length && !currentSubSys) {
      setCurrentSubSys(itemArr[0].name);
    }

    return (
      <Select key="21" style={style} value={currentSubSys}>
        {itemArr.map((item) => {
          return <Select.Option value={item.name}>{item.name}</Select.Option>;
        })}
      </Select>
    );
  }

  const itemArr = _.get(data, "getImageCatalogOptions.items", []);
  if (itemArr.length && !currentCategory) {
    setCurrentCategory(itemArr[0].name);
  }

  return (
    <div style={{ padding: 20 }}>
      <Select
        key="0"
        value={currentCategory}
        style={style}
        onChange={(value) => {
          setCurrentCategory(value);
          setCurrentSys("");
          setCurrentSubSys("");
        }}
      >
        {itemArr.map((item, index) => (
          <Select.Option key={item.name}>{item.name}</Select.Option>
        ))}
      </Select>

      {genSys()}
      {genSubsys()}
    </div>
  );
}

export function ClusterList({ children }) {
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentSys, setCurrentSys] = useState("");
  const [currentSubSys, setCurrentSubSys] = useState("");

  const style = { width: 260, marginRight: 10 };

  return (
    <Form
      // affixButtons={false}
      initialValues={{
        code: "caicloud.rar",
        readyonly: "antdesignexample",
      }}
      onSubmit={(values) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(values);
            resolve(values);
          }, 3000);
        });
      }}
    >
      <Query query={GetImageCatalogOptions} variables={{ path: "/" }}>
        {({ data, loading }) => {
          if (loading) {
            return <Spin />;
          }

          const itemCatArr = _.get(data, "getImageCatalogOptions.items", []);

          setCurrentCategory((val) => val || itemCatArr[0].name);

          return (
            <div style={{ paddingBottom: 20 }}>
              <Select
                value={currentCategory}
                style={style}
                onChange={(value) => {
                  setCurrentCategory(value);
                  setCurrentSys("");
                  setCurrentSubSys("");
                }}
              >
                {itemCatArr.map((item, index) => (
                  <Select.Option key={item.name}>{item.name}</Select.Option>
                ))}
              </Select>

              <Query
                query={GetImageCatalogOptions}
                variables={{ path: `/${currentCategory}` }}
                skip={!currentCategory}
              >
                {({ data, loading }) => {
                  if (loading || !currentCategory) {
                    return <Select key="0" style={style} loading></Select>;
                  }

                  const itemSysArr = _.get(
                    data,
                    "getImageCatalogOptions.items",
                    []
                  );
                  setCurrentSys((val) => val || itemSysArr[0].name);

                  return (
                    <Select
                      style={style}
                      value={currentSys}
                      onChange={(value) => {
                        setCurrentSys(value);
                        setCurrentSubSys("");
                      }}
                    >
                      {itemSysArr.map((item) => {
                        return (
                          <Select.Option value={item.name}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  );
                }}
              </Query>

              <Query
                query={GetImageCatalogOptions}
                variables={{ path: `/${currentCategory}/${currentSys}` }}
                skip={!currentSys || !currentCategory}
              >
                {({ data, loading }) => {
                  if (loading || !currentSys || !currentCategory) {
                    return (
                      <Select key="0" style={style} loading={true}></Select>
                    );
                  }

                  const itemArr = _.get(
                    data,
                    "getImageCatalogOptions.items",
                    []
                  );
                  setCurrentSubSys((val) => val || itemArr[0].name);

                  return (
                    <Select
                      style={style}
                      value={currentSubSys}
                      onChange={(value) => {
                        setCurrentSubSys(value);
                      }}
                    >
                      {itemArr.map((item) => {
                        return (
                          <Select.Option value={item.name}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  );
                }}
              </Query>
            </div>
          );
        }}
      </Query>

      <Field
        required
        noField
        label="系统分类"
        name="cate"
        component={currentCategory || "--"}
      />
      <Field
        required
        noField
        label="父系统"
        name="parentSys"
        component={currentSys || "--"}
      />
      <Field
        required
        noField
        label="子系统"
        name="sys"
        component={currentSubSys || "--"}
      />

      <Field
        required
        label="必填字段"
        name="name"
        component="input"
        labelTooltip="这是名称"
        tips="支持中文和特殊符号，长度限制 2-32 个字符。"
        asyncValidate={(val) => {
          if (val.length < 2) {
            return "需要至少2个字符";
          } else if (val.length > 32) {
            return "最多32个字符";
          }
        }}
      />

      <FieldArray
        atLeastOne
        label="配置"
        name="setting"
        renderFieldItem={(name, index) => (
          <div key={index} style={{ display: "flex" }}>
            <Field
              name={`${name}.key`}
              placeholder="键"
              componentStyle={{ width: 200, marginRight: 8 }}
            />
            <Field
              name={`${name}.value`}
              placeholder="值"
              componentStyle={{ width: 200 }}
            />
          </div>
        )}
      />
    </Form>
  );
}
