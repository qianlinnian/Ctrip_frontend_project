import { react, useState } from 'react'
import CtripSider from '../../components/ctripsider.jsx'
import CtripHeader from '../../components/ctripheader.jsx'
import { Table } from 'antd'





const AuditPage = () => {

    const auditColumn = [
        { title: '申请ID', dataIndex: 'id', key: 'id' },
        { title: '酒店名称', dataIndex: 'name', key: 'name' },
        { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
        { title: '联系方式', dataIndex: 'contact', key: 'contact' },
        { title: '申请类型', dataIndex: 'type', key: 'type' },
        { title: '提交时间', dataIndex: 'time', key: 'time' },
        { title: '审核状态', dataIndex: 'auditStatus', key: 'auditStatus' },
        { title: '发布状态', dataIndex: 'publishStatus', key: 'publishStatus' },
        { title: '操作', dataIndex: 'action', key: 'action' },
    ]


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
                                    全部 (8)
                                </button>
                                <button class="btn btn-sm" onclick="filterStatus('pending')" id="btnPending">
                                    待审核 (5)
                                </button>
                                <button class="btn btn-sm" onclick="filterStatus('approved')" id="btnApproved">
                                    已通过 (2)
                                </button>
                                <button class="btn btn-sm" onclick="filterStatus('rejected')" id="btnRejected">
                                    已拒绝 (1)
                                </button>
                            </div>
                        </div>
                        <div class="toolbar-right">
                            <div class="search-box">
                                <span>🔍</span>
                                <input type="text" placeholder="搜索申请人/酒店名称..." />
                            </div>
                        </div>
                    </div>

                    {/* <!-- 数据表格 --> */}
                    <div class="data-table">
                        <Table columns={auditColumn} dataSource={auditColumn} />
                    </div>

                </div>

            </main>

        </div>

    )
}

export default AuditPage