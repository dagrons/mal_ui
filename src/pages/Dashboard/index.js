import { useState, useEffect } from "react";
import { Row, Col, Space, Card, Statistic, Table } from "antd";
import { Line, Bar, RingProgress, TinyArea, Area } from "@ant-design/charts";

import { getAPTDistribution, getDashboard, getPendingCnt } from "../../api";

import "antd/dist/antd.css";
import "./index.scss";

export default () => {
  const [pendingCnt, setPendingCnt] = useState(0);
  const [current, setCurrent] = useState(0);  
  const [uploaded, setUploaded] = useState(0);
  const [recent, setRecent] = useState(0);
  const [tinyarea_data, setTinyAreaData] = useState([]);
  const [typeres_data, setTyperesData] = useState([]);  
  const [APTDistributionData, setAPTDistributionData] = useState([]);
  const [dist, setDist] = useState([
    { type: "Ramnit", value: 0 },
    { type: "Lollipop", value: 0 },
    { type: "Kelihos_ver3", value: 0 },
    { type: "Vundo", value: 0 },
    { type: "Simda", value: 0 },
    { type: "Tracur", value: 0 },
    { type: "Kelihos_ver1", value: 0 },
    { type: "Obfuscator", value: 0 },
    { type: "Gatak", value: 0 },
  ]);

  useEffect(() => {
    getPendingCnt()
    .then(res => res.data)
    .then(data => {
      setPendingCnt(data);;
    })
  }, []);

  useEffect(() => {
    getDashboard()
      .then((res) => res.data)
      .then((data) => {
        setUploaded(data.samples_count);
        setCurrent(data.current_count);
        setRecent(data.recent_count);
        setTinyAreaData(data.trend_area);
        const typeres = [];

        let cnt = 0;
        for (const [k, v] of Object.entries(data.type_res)) {
          typeres.push({ family: k, count: v });
          cnt += v;
        }
        setTyperesData(typeres);

        let idx = 0;
        let t = [];
        for (const [k, v] of Object.entries(data.type_res)) {
          t[idx++] = { type: k, value: v / cnt };
        }
        setDist(t);
      });
  }, []);

  useEffect(()=>{
    getAPTDistribution()
    .then(res => res.data)
    .then(data => {
      let t = []      
      for (const [k, v] of Object.entries(data)) {
        t.push({ family: k, count: v });        
      }      
      setAPTDistributionData(t)
    })
  }, [])

  const propsArea = {
    xField: 'year',
    yField: 'value',
    height: 150,
    // autoFit: false,
    data: tinyarea_data,
    smooth: true,
  };

  const propsBar = (data) => {
    return {
      data,
      height: 300,
      xField: "count",
      yField: "family",
      seriesField: "family",
      legend: { position: "top-left" },
    }
  }

  const propsTable = (data) => {
    return {
      dataSource: data,
      height: 250,
      columns: [
        {
          title: "family",
          dataIndex: "family",
          key: "family",
        },
        {
          title: "count",
          dataIndex: "count",
          key: "count",
        },
      ],
      size: "small",
      showHeader: false,
      pagination: { position: ["none", "none"] },
    }    
  };

  return (
    <div className="dashboard-content">      
      {/* ????????????, ????????????, ????????? */}
      <Row gutter={[16, 16]}>

        <Col flex="1 1 auto">
          <Card
            title="????????????"
            style={{
              height: "188px",
            }}
          >
            <Space>
              <Statistic title="?????????" value={uploaded} />
              <Statistic title="????????????" value={pendingCnt} />
              <Statistic title="????????????" value={current} />
              <Statistic title="?????????????????????" value={recent} />
            </Space>
          </Card>
        </Col>

        <Col flex="1 1 auto">
          <Card title="??????????????????">
            <div>
              <Space>
                {dist.map((t) => (
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {t.type}
                    <RingProgress
                      width={60}
                      height={60}
                      percent={t.value}
                      color={["#30BF78", "#E8EDF3"]}
                    />
                  </div>
                ))}
              </Space>
            </div>
          </Card>
        </Col>        
      </Row>
    
      <Row
        gutter={[16, 16]}
        style={{
          marginTop: "16px", // Row???Row?????????margin???marinTop??????
        }}
      >
        <Col flex="1 1 auto">
          <Card
            title="?????????????????????"            
          >
            <Area {...propsArea} />
          </Card>
        </Col>
      </Row>
          
      {/* ?????????????????? */}
      <Row
        gutter={[16, 16]}
        style={{
          marginTop: "16px", // Row???Row?????????margin???marinTop??????
        }}
      >
        <Col flex="auto">
          <Card title="????????????????????????">
            <Row gutter={16} align="middle">
              <Col span={16}>
                <Bar {...propsBar(typeres_data)} />
              </Col>
              <Col span={8}>
                <Table {...propsTable(typeres_data)} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      {/* APT???????????? */}
      <Row
        gutter={[16, 16]}
        style={{
          marginTop: "16px", // Row???Row?????????margin???marinTop??????
        }}
      >
        <Col flex="auto">
          <Card title="??????APT??????????????????">
            <Row gutter={16} align="middle">
              <Col span={16}>
                <Bar {...propsBar(APTDistributionData)} />
              </Col>
              <Col span={8}>
                <Table {...propsTable(APTDistributionData)} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

    </div>
  );
};
