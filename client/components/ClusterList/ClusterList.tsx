import React, { useState, Fragment } from "react";
import { Query, withApollo } from "react-apollo";
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

export default function ClusterList({ children }) {
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

          const itemCatArr = data.getImageCatalogOptions.items;
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

                  const itemSysArr = data.getImageCatalogOptions.items;
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

                  const itemArr = data.getImageCatalogOptions.items;
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
