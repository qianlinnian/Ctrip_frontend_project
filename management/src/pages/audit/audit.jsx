import { react, useState, useEffect } from 'react'
import CtripSider from '../../components/ctripsider.jsx'
import CtripHeader from '../../components/ctripheader.jsx'
import HotelDetails from './hotel-details.jsx'
import { AUDIT_STATUS } from '../../utils/statusMap.js'
import { Table, Button, Modal, Input } from 'antd'
import apiService from '../../services/api.js'


const {TextArea} = Input


const AuditPage = () => {

    const [auditList, setAuditList] = useState([])
    const [isShowModal, setIsShowModal] = useState(false)
    const [auditReason, setAuditReason] = useState('')
    
    const [currentRecord, setCurrentRecord] = useState({})

    //dataIndex与返回数据字段对应
    const auditColumn = [
        { title: '申请ID', dataIndex: 'hotel_id', key: 'id' },
        { title: '酒店名称', dataIndex: 'hotel_name', key: 'name' },
        // { title: '申请人', dataIndex: 'applicant_name', key: 'applicant' },
        { title: '联系方式', dataIndex: 'phone', key: 'phone' },
        // { title: '申请类型', dataIndex: 'application_type', key: 'type' },
        { title: '提交时间', dataIndex: 'create_time', key: 'time' },
        { title: '审核状态', dataIndex: 'audit_status', key: 'status', 
            render: (text, record) => (
                <div>
                    {AUDIT_STATUS[record.audit_status]}
                </div>
            )
         },
        // { title: '发布状态', dataIndex: 'publishStatus', key: 'publishStatus' },
        { title: '操作', dataIndex: 'action', key: 'action',
            render: (text, record) => (
                <Button onClick={() => {setCurrentRecord(record); setIsShowModal(true)}}>操作</Button>

            )
         }
    ]


    const auditState = {
        all: 0, pending: 0, approved: 0, rejected: 0
    }

    const fetchAuditList = async() => {

        //返回的数据时json格式
        const response = await apiService.get('/audit/get-audit-queue')
        const data = response
        //console.log('data from fetchiAuditList:', response)
        setAuditList(data)
    }
    useEffect(() => {
        fetchAuditList()
    }, [])


    const handleOk = () => {
        setIsShowModal(false)
    }

    const handleCancel = () => {
        setIsShowModal(false)
    }


    const handleApprove = async () => {
        const data = {
            hotel_id:currentRecord.hotel_id,
            action: 'approve',
            audit_reason: ''
        }
        console.log('审核通过:', data)
        await apiService.post('/audit/handle-audit', data)
        setIsShowModal(false)
        await fetchAuditList()
    }

    const handleReject = async () => {
        const data = {
            hotel_id:currentRecord.hotel_id,
            action: 'reject',
            audit_reason: auditReason
        }
        await apiService.post('/audit/handle-audit', data)
        console.log('审核拒绝:', data)
        setIsShowModal(false)
        await fetchAuditList()
    }
    
    return (
        <div className="admin-layout">

            {/* <!-- 侧边栏 --> */}
            <CtripSider role='审核管理' title='待审核'/>
            {/* <!-- 主内容区 --> */}
            <main className="admin-main">

                {/* <!-- 顶部栏 --> */}
                <CtripHeader/>

                {/* <!-- 内容区 --> */}
                <div className="admin-content">

                    {/* <!-- 操作栏 --> */}
                    <div className="content-toolbar">
                        <div className="toolbar-left">
                            <div className="btn-group">
                                <button className="btn btn-sm" onClick={() => filterStatus('all')} id="btnAll">
                                    全部 {auditState.all}
                                </button>
                                <button className="btn btn-sm" onClick={() => filterStatus('pending')} id="btnPending">
                                    待审核 {auditState.pending}
                                </button>
                                <button className="btn btn-sm" onClick={() => filterStatus('approved')} id="btnApproved">
                                    已通过 {auditState.approved}
                                </button>
                                <button className="btn btn-sm" onClick={() => filterStatus('rejected')} id="btnRejected">
                                    已拒绝 {auditState.rejected}
                                </button>
                            </div>
                        </div>
                        <div className="toolbar-right">
                            <div className="search-box">
                                <span>🔍</span>
                                <input type="text" placeholder="搜索申请人/酒店名称..." />
                            </div>
                        </div>
                        <div className="toolbar-right">
                            <Button className="btn btn-sm" onClick={fetchAuditList}>刷新</Button>
                        </div>
                    </div>

                    {/* <!-- 数据表格 --> */}
                    <div className="data-table">
                        <Table columns={auditColumn} dataSource={auditList} />
                    </div>
                    <Modal title='审核处理'
                        open={isShowModal} 
                        onOk={handleOk} 
                        onCancel={handleCancel}
                        footer={[
                            <Button type='primary' onClick={handleApprove}>审核通过</Button>, 
                            <Button type='danger' onClick={handleReject}>审核拒绝</Button>, 
                            <Button type='primary' onClick={handleCancel}>取消</Button>
                        ]}>
                        <HotelDetails hotel_id={currentRecord.hotel_id}/>
                        <TextArea rows={4} placeholder='请输入审核说明' onChange={(e) => {setAuditReason(e.target.value)}} />
                    </Modal>

                </div>

            </main>

        </div>

    )
}


export default AuditPage
