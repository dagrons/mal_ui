/**
 * libs
 */
import React, { useContext } from 'react';
import { Tabs, Table, Typography, List } from 'antd';

/**
 * local components
 */
import { REPORT } from '../pages/Feature';

/**
 * unpack
 */
const { TabPane } = Tabs;
const { Title } = Typography;

/**
 * config
 */
const config = {
  procMemory_columns: [
    {
      title: '标志',
      dataIndex: 'protect',
    },
    {
      title: '起始地址',
      dataIndex: 'addr',
    },
    {
      title: '结束地址',
      dataIndex: 'end',
    },
    {
      title: '状态位',
      dataIndex: 'state',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '大小',
      dataIndex: 'size',
    },
  ]
}

export default () => {
  /**
   * state
   */
  const { cuckoo } = useContext(REPORT);
  const procmem = cuckoo.procmem ? cuckoo.procmemory[0].regions : null;
  const summary = cuckoo.behavior.summary;

  /**
   * ui
   */
  return (
      <Tabs defaultActiveKey='1' tabPosition="top">

        {/* 内存分布 */}
        {procmem != null && 
          <TabPane tab="内存分布" key="1">
            <Table dataSource={procmem} columns={config.procMemory_columns} />
          </TabPane>
        }

        {/* 文件操作 */}
        {summary != null &&
          <TabPane tab="文件操作" key='3'>
            <div>
              <Title level={5}>文件创建</Title>
              <List
                bordered
                dataSource={summary.file_created}
                renderItem={item => (
                  <List.Item>
                    {item}
                  </List.Item>
                )}
              />
              <Title level={5}>文件重创建</Title>
              <List
                bordered
                dataSource={summary.file_recreated}
                renderItem={item => (
                  <List.Item>
                    {item}
                  </List.Item>
                )}
              />
              <Title level={5}>文件打开</Title>
              <List
                bordered
                dataSource={summary.file_opened}
                renderItem={item => (
                  <List.Item>
                    {item}
                  </List.Item>
                )}
              />
              <Title level={5}>文件读取</Title>
              <List
                bordered
                dataSource={summary.file_read}
                renderItem={item => (
                  <List.Item>
                    {item}
                  </List.Item>
                )}
              />
            </div>
          </TabPane>
        }

        {/* 互斥量 */}
        {summary &&
          <TabPane tab="互斥量" key='4'>
            <List
              bordered
              dataSource={summary.mutex}
              renderItem={item => (
                <List.Item>
                  {item}
                </List.Item>
              )}
            />
          </TabPane>
        }

        {/* 动态链接库 */}
        {summary &&
          <TabPane tab="动态链接库" key='5'>
            <List
              bordered
              dataSource={summary.dll_loaded}
              renderItem={item => (
                <List.Item>
                  {item}
                </List.Item>
              )}
            />
          </TabPane>
        }

        {/* 注册表 */}
        {summary &&
          <TabPane tab="注册表" key='6'>
            <List
              bordered
              dataSource={summary.regkey_read}
              renderItem={item => (
                <List.Item>
                  {item}
                </List.Item>
              )}
            />
          </TabPane>
        }

      </Tabs>
  );
}