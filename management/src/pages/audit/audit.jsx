import { react, useState, useEffect } from 'react'
import CtripSider from '../../components/ctripsider.jsx'
import CtripHeader from '../../components/ctripheader.jsx'
import HotelDetails from './hotel-details.jsx'

import { Table, Button, Modal } from 'antd'
import apiService from '../../services/api.js'





const AuditPage = () => {

    const [auditList, setAuditList] = useState([])
    const [isShowModal, setIsShowModal] = useState(false)
    

    //dataIndex与返回数据字段对应
    const auditColumn = [
        { title: '申请ID', dataIndex: 'id', key: 'id' },
        { title: '酒店名称', dataIndex: 'name', key: 'name' },
        { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
        { title: '联系方式', dataIndex: 'phone', key: 'phone' },
        { title: '申请类型', dataIndex: 'type', key: 'type' },
        { title: '提交时间', dataIndex: 'time', key: 'time' },
        { title: '审核状态', dataIndex: 'status', key: 'status' },
        // { title: '发布状态', dataIndex: 'publishStatus', key: 'publishStatus' },
        { title: '操作', dataIndex: 'action', key: 'action',
            render: (text, record) => (
                <Button onClick={() => {setIsShowModal(true)}}>操作</Button>
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
        console.log('data from fetchiAuditList:', response)
        setAuditList(data)
    }

    useEffect(() => {
        console.log('auditList:', auditList)
    }, [auditList])



    const handleOk = () => {
        setIsShowModal(false)
    }

    const handleCancel = () => {
        setIsShowModal(false)
    }

    return (
        <div class="admin-layout">

            {/* <!-- 侧边栏 --> */}
            <CtripSider role='审核管理' title='待审核'/>
            {/* <!-- 主内容区 --> */}
            <main class="admin-main">

                {/* <!-- 顶部栏 --> */}
                <CtripHeader/>

                {/* <!-- 内容区 --> */}
                <div class="admin-content">

                    {/* <!-- 操作栏 --> */}
                    <div class="content-toolbar">
                        <div class="toolbar-left">
                            <div class="btn-group">
                                <button class="btn btn-sm" onclick="filterStatus('all')" id="btnAll">
                                    全部 {auditState.all}
                                </button>
                                <button class="btn btn-sm" onclick="filterStatus('pending')" id="btnPending">
                                    待审核 {auditState.pending}
                                </button>
                                <button class="btn btn-sm" onclick="filterStatus('approved')" id="btnApproved">
                                    已通过 {auditState.approved}
                                </button>
                                <button class="btn btn-sm" onclick="filterStatus('rejected')" id="btnRejected">
                                    已拒绝 {auditState.rejected}
                                </button>
                            </div>
                        </div>
                        <div class="toolbar-right">
                            <div class="search-box">
                                <span>🔍</span>
                                <input type="text" placeholder="搜索申请人/酒店名称..." />
                            </div>
                        </div>
                        <div class="toolbar-right">
                            <Button class="btn btn-sm" onClick={fetchAuditList}>刷新</Button>
                        </div>
                    </div>

                    {/* <!-- 数据表格 --> */}
                    <div class="data-table">
                        <Table columns={auditColumn} dataSource={auditList} />
                    </div>
                    <Modal title='审核处理' open={isShowModal} onOk={handleOk} onCancel={handleCancel}>
                        <HotelDetails />
                    </Modal>

                </div>

            </main>

        </div>

    )
}


export default AuditPage
