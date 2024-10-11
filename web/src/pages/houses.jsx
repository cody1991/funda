import axios from "axios"
import { useEffect, useState } from "react"
import { Table, Image } from "antd"
function Houses() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const fetchData = (page, pageSize) => {
    const token = localStorage.getItem('token');
    console.log(token)
    axios.get('http://localhost:3000/house', {
      params: {
        page,
        pageSize
      },
      headers: {
        'Authorization': `Bearer ${token}`, // 将 Token 添加到请求头
      }
    }).then(res => {
      setData(res.data.list)
      setTotal(res.data.total)
    })
  }
  const columns = [
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      render(url, record) {
        return <a target="_blank" href={url} ><strong style={{ fontSize: 22 }}>{record.title}</strong> {record.location ? ` (${record.location})` : ''}</a>
      },
      width: 200,
      fixed: 'left',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 200,
      render(_, record) {
        return <div>
          <p>总价: {record.price}</p>
          <p>每平米的价格: {record.prePrice}</p>
        </div>
      },
    },
    {
      title: '房子属性',
      dataIndex: 'size',
      key: 'size',
      width: 300,
      render(_, record) {
        return <div>
          <p>类型: {record.type}</p>
          <p>大小: {record.size}</p>
          <p>能源等级: {record.energy}</p>
          <p>时间: {record.year}</p>
          <p>房间数量: {record.rooms}</p>
          <p>VVE: : {record.vve}</p>
        </div>
      },
    },

    {
      title: '发布相关',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 250,
      render(_, record) {
        return <div>
          <p>当前状态: {record.status}</p>
          <p>发布时间: {record.publishTime}</p>
          <p>观看人数: {record.watch}</p>
          <p>收藏人数: {record.like}</p>
        </div>
      },
    },
    {
      title: '素材',
      dataIndex: 'cover',
      key: 'cover',
      render(cover, record) {
        return <div>
          <Image
            width={400}
            src={cover}
          />
          {record.video ? <video
            src={record.video}
            width={400}
            controls
            poster={record.videoPoster}
            style={{ marginTop: 10 }}
          /> : ''}
        </div>

      },
      width: 420
    },
    {
      title: '介绍',
      dataIndex: 'description',
      key: 'description',
      width: 500,
      render(description,) {
        return <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {description}
        </div>
      },
    },

  ];
  useEffect(() => {
    fetchData(page, pageSize)
  }, [])
  console.log('total', total)
  return (
    <Table
      rowKey="url"
      scroll={{ x: 800, }}
      columns={columns}
      dataSource={data}
      showSizeChanger={true}
      pagination={{
        total,
        pageSize,
        current: page,
        onChange(page, pageSize) {
          setPage(page)
          setPageSize(pageSize)
          fetchData(page, pageSize)
        }
      }} />
  )
}

export default Houses
