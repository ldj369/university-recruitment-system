<template>
  <div class="registration-form">
    <div class="form-header">
      <h2>*****应聘人员报名登记表</h2>
    </div>

    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="registration-form-content">

      <!-- 基本信息 -->
      <div class="form-section">
        <h3>一、基本信息</h3>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="form.name" placeholder="请输入姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="form.gender" placeholder="请选择性别">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出生年月" prop="birthDate">
                  <el-date-picker
                    v-model="form.birthDate"
                    type="month"
                    placeholder="选择出生年月"
                    format="YYYY.MM"
                    value-format="YYYY-MM"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="生源地" prop="birthPlace">
                  <el-input v-model="form.birthPlace" placeholder="请输入生源地" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="婚姻情况" prop="maritalStatus">
                  <el-select v-model="form.maritalStatus" placeholder="请选择婚姻情况">
                    <el-option label="已婚" value="已婚" />
                    <el-option label="未婚" value="未婚" />
                    <el-option label="离异" value="离异" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="政治面貌" prop="politicalStatus">
                  <el-select v-model="form.politicalStatus" placeholder="请选择政治面貌">
                    <el-option label="中共党员" value="中共党员" />
                    <el-option label="中共预备党员" value="中共预备党员" />
                    <el-option label="共青团员" value="共青团员" />
                    <el-option label="民主党派" value="民主党派" />
                    <el-option label="群众" value="群众" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专业技术职务" prop="professionalTitle">
                  <el-input v-model="form.professionalTitle" placeholder="请输入专业技术职务" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="最高学历" prop="highestEducation">
                  <el-select v-model="form.highestEducation" placeholder="请选择最高学历">
                    <el-option label="高中" value="高中" />
                    <el-option label="大专" value="大专" />
                    <el-option label="本科" value="本科" />
                    <el-option label="硕士研究生" value="硕士研究生" />
                    <el-option label="博士研究生" value="博士研究生" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最高学位" prop="highestDegree">
                  <el-select v-model="form.highestDegree" placeholder="请选择最高学位">
                    <el-option label="无学位" value="无学位" />
                    <el-option label="学士学位" value="学士学位" />
                    <el-option label="硕士学位" value="硕士学位" />
                    <el-option label="博士学位" value="博士学位" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="身份证号码" prop="idCard">
                  <el-input v-model="form.idCard" placeholder="请输入身份证号码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入联系电话" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="电子邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入电子邮箱" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <div class="photo-upload">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :on-success="handlePhotoSuccess"
                :before-upload="beforePhotoUpload"
                :http-request="uploadAvatar"
              >
                <img v-if="form.photo" :src="getPhotoUrl(form.photo)" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="photo-label">最近面貌</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 家庭情况 -->
      <div class="form-section">
        <h3>二、家庭情况</h3>
        <el-table 
          :data="form.familyMembers" 
          border 
          style="width: 100%"
          fit
          resizable
        >
          <el-table-column prop="name" label="姓名" min-width="15%">
            <template #default="{ row, $index }">
              <el-input v-model="row.name" placeholder="请输入姓名" />
            </template>
          </el-table-column>
          <el-table-column prop="relationship" label="与本人关系" min-width="15%">
            <template #default="{ row, $index }">
              <el-select v-model="row.relationship" placeholder="请选择关系" style="width: 100%">
                <el-option label="父亲" value="父亲" />
                <el-option label="母亲" value="母亲" />
                <el-option label="配偶" value="配偶" />
                <el-option label="子女" value="子女" />
                <el-option label="其他" value="其他" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="birthDate" label="出生年月" min-width="15%">
            <template #default="{ row, $index }">
              <el-date-picker
                v-model="row.birthDate"
                type="month"
                placeholder="选择出生年月"
                format="YYYY.MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="politicalStatus" label="政治面貌" min-width="15%">
            <template #default="{ row, $index }">
              <el-input v-model="row.politicalStatus" placeholder="请输入政治面貌" />
            </template>
          </el-table-column>
          <el-table-column prop="workplace" label="所在单位" min-width="30%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.workplace" 
                type="textarea" 
                placeholder="请输入所在单位"
                :autosize="{ minRows: 1, maxRows: 2 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" align="center">
            <template #default="{ row, $index }">
              <el-button @click="removeFamilyMember($index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addFamilyMember" type="primary" style="margin-top: 10px;">添加家庭成员</el-button>
      </div>

      <!-- 教育经历 -->
      <div class="form-section">
        <h3>三、教育经历</h3>
        <el-table 
          :data="form.educationHistory.records" 
          border 
          style="width: 100%" 
          fit
          resizable
        >
          <el-table-column prop="startDate" label="起止年月" min-width="25%">
            <template #default="{ row, $index }">
              <el-date-picker
                v-model="row.startDate"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                format="YYYY.MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="school" label="毕业院校" min-width="20%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.school" 
                type="textarea" 
                placeholder="请输入毕业院校"
                :autosize="{ minRows: 1, maxRows: 2 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="major" label="专业" min-width="20%">
            <template #default="{ row, $index }">
              <el-input v-model="row.major" placeholder="请输入专业" />
            </template>
          </el-table-column>
          <el-table-column prop="degree" label="学历层次" min-width="15%">
            <template #default="{ row, $index }">
              <el-select v-model="row.degree" placeholder="请选择学历" style="width: 100%">
                <el-option label="高中" value="高中" />
                <el-option label="大专" value="大专" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士" value="硕士" />
                <el-option label="博士" value="博士" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="mentor" label="导师" min-width="10%">
            <template #default="{ row, $index }">
              <el-input v-model="row.mentor" placeholder="请输入导师" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" align="center">
            <template #default="{ row, $index }">
              <el-button @click="removeEducation($index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addEducation" type="primary" style="margin-top: 10px;">添加教育经历</el-button>
      </div>
      <!-- 工作经历 -->
      <div class="form-section">
        <h3>四、工作经历</h3>
        <el-table 
          :data="form.workHistory" 
          border 
          style="width: 100%"
          fit
          resizable
        >
          <el-table-column prop="startDate" label="起止年月" min-width="25%">
            <template #default="{ row, $index }">
              <el-date-picker
                v-model="row.startDate"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                format="YYYY.MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="company" label="工作单位" min-width="30%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.company" 
                type="textarea" 
                placeholder="请输入工作单位"
                :autosize="{ minRows: 1, maxRows: 2 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="position" label="岗位" min-width="15%">
            <template #default="{ row, $index }">
              <el-input v-model="row.position" placeholder="请输入岗位" />
            </template>
          </el-table-column>
          <el-table-column prop="duties" label="职务" min-width="20%">
            <template #default="{ row, $index }">
              <el-input v-model="row.duties" placeholder="请输入职务" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" align="center">
            <template #default="{ row, $index }">
              <el-button @click="removeWork($index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addWork" type="primary" style="margin-top: 10px;">添加工作经历</el-button>
      </div>

      <!-- 学术成果 -->
      <div class="form-section">
        <h3>五、学术成果</h3>
        
        <!-- 近五年来发表的论文 -->
        <h4>（一）近五年来发表的论文</h4>
        <el-table 
          :data="form.academicAchievements.papers" 
          border 
          style="width: 100%; margin-bottom: 20px;"
          fit
          resizable
        >
          <el-table-column prop="title" label="论文题目" min-width="25%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.title" 
                type="textarea" 
                placeholder="请输入论文题目"
                :autosize="{ minRows: 1, maxRows: 3 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="journal" label="发表期刊" min-width="20%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.journal" 
                type="textarea" 
                placeholder="请输入发表期刊"
                :autosize="{ minRows: 1, maxRows: 2 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="publishDate" label="发表时间" min-width="15%">
            <template #default="{ row, $index }">
              <el-date-picker
                v-model="row.publishDate"
                type="month"
                placeholder="选择发表时间"
                format="YYYY.MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="category" label="刊物级别" min-width="12%">
            <template #default="{ row, $index }">
              <el-select v-model="row.category" placeholder="请选择级别" style="width: 100%">
                <el-option label="SCI" value="SCI" />
                <el-option label="EI" value="EI" />
                <el-option label="核心期刊" value="核心期刊" />
                <el-option label="一般期刊" value="一般期刊" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="ranking" label="排名" min-width="8%">
            <template #default="{ row, $index }">
              <el-input v-model="row.ranking" placeholder="排名" />
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注" min-width="12%">
            <template #default="{ row, $index }">
              <el-input v-model="row.note" placeholder="备注" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="8%" align="center">
            <template #default="{ row, $index }">
              <el-button @click="removePaper($index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addPaper" type="primary" style="margin-bottom: 20px;">添加论文</el-button>

        <!-- 近五年来主持或参与的科研项目 -->
        <h4>（二）近五年来主持或参与的科研项目（课题）</h4>
        <el-table 
          :data="form.academicAchievements.projects" 
          border 
          style="width: 100%; margin-bottom: 20px;"
          fit
          resizable
        >
          <el-table-column prop="name" label="项目来源" min-width="20%">
            <template #default="{ row, $index }">
              <el-input v-model="row.name" placeholder="请输入项目来源" />
            </template>
          </el-table-column>
          <el-table-column prop="funding" label="经费（万元）" min-width="12%">
            <template #default="{ row, $index }">
              <el-input v-model="row.funding" placeholder="请输入经费" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="项目（课题）名称" min-width="30%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.title" 
                type="textarea" 
                placeholder="请输入项目名称"
                :autosize="{ minRows: 1, maxRows: 3 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="项目起止时间" min-width="18%">
            <template #default="{ row, $index }">
              <el-date-picker
                v-model="row.duration"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                format="YYYY.MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="role" label="排名" min-width="10%">
            <template #default="{ row, $index }">
              <el-input v-model="row.role" placeholder="排名" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" align="center">
            <template #default="{ row, $index }">
              <el-button @click="removeProject($index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addProject" type="primary" style="margin-bottom: 20px;">添加项目</el-button>

        <!-- 近五年来获得的专利、软件著作权等 -->
        <h4>（三）近五年来获得的专利、软件著作权等</h4>
        <el-table 
          :data="form.academicAchievements.patents" 
          border 
          style="width: 100%; margin-bottom: 20px;"
          fit
          resizable
        >
          <el-table-column prop="type" label="专利类型（专利号）" min-width="25%">
            <template #default="{ row, $index }">
              <el-input v-model="row.type" placeholder="请输入专利类型" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="专利名称" min-width="35%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.name" 
                type="textarea" 
                placeholder="请输入专利名称"
                :autosize="{ minRows: 1, maxRows: 3 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="grantDate" label="授权年月" min-width="15%">
            <template #default="{ row, $index }">
              <el-date-picker
                v-model="row.grantDate"
                type="month"
                placeholder="选择授权年月"
                format="YYYY.MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="ranking" label="排名" min-width="15%">
            <template #default="{ row, $index }">
              <el-input v-model="row.ranking" placeholder="排名" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" align="center">
            <template #default="{ row, $index }">
              <el-button @click="removePatent($index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addPatent" type="primary" style="margin-bottom: 20px;">添加专利</el-button>

        <!-- 近五年来出版的著作 -->
        <h4>（四）近五年来出版的著作（教材）等</h4>
        <el-table 
          :data="form.academicAchievements.books" 
          border 
          style="width: 100%; margin-bottom: 20px;"
          fit
          resizable
        >
          <el-table-column prop="type" label="类型" min-width="15%">
            <template #default="{ row, $index }">
              <el-select v-model="row.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="著作" value="著作" />
                <el-option label="教材" value="教材" />
                <el-option label="译著" value="译著" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="publisher" label="出版社" min-width="20%">
            <template #default="{ row, $index }">
              <el-input v-model="row.publisher" placeholder="请输入出版社" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="书目" min-width="30%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.title" 
                type="textarea" 
                placeholder="请输入书目"
                :autosize="{ minRows: 1, maxRows: 3 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="publishDate" label="出版时间" min-width="15%">
            <template #default="{ row, $index }">
              <el-date-picker
                v-model="row.publishDate"
                type="month"
                placeholder="选择出版时间"
                format="YYYY.MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="ranking" label="排名" min-width="10%">
            <template #default="{ row, $index }">
              <el-input v-model="row.ranking" placeholder="排名" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" align="center">
            <template #default="{ row, $index }">
              <el-button @click="removeBook($index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addBook" type="primary" style="margin-bottom: 20px;">添加著作</el-button>

        <!-- 近五年来获得的教学科研成果 -->
        <h4>（五）近五年来获得的教学科研成果</h4>
        <el-table 
          :data="form.academicAchievements.achievements" 
          border 
          style="width: 100%; margin-bottom: 20px;"
          fit
          resizable
        >
          <el-table-column prop="type" label="成果类型" min-width="20%">
            <template #default="{ row, $index }">
              <el-select v-model="row.type" placeholder="请选择类型" style="width: 100%">
                <el-option label="教学成果奖" value="教学成果奖" />
                <el-option label="科研成果奖" value="科研成果奖" />
                <el-option label="其他奖项" value="其他奖项" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="成果名称" min-width="30%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.name" 
                type="textarea" 
                placeholder="请输入成果名称"
                :autosize="{ minRows: 1, maxRows: 3 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="level" label="获奖等级" min-width="15%">
            <template #default="{ row, $index }">
              <el-input v-model="row.level" placeholder="请输入获奖等级" />
            </template>
          </el-table-column>
          <el-table-column prop="awardDate" label="获奖时间" min-width="15%">
            <template #default="{ row, $index }">
              <el-date-picker
                v-model="row.awardDate"
                type="month"
                placeholder="选择获奖时间"
                format="YYYY.MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column prop="ranking" label="排名" min-width="10%">
            <template #default="{ row, $index }">
              <el-input v-model="row.ranking" placeholder="排名" />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" align="center">
            <template #default="{ row, $index }">
              <el-button @click="removeAchievement($index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addAchievement" type="primary" style="margin-bottom: 20px;">添加成果</el-button>

        <!-- 近五年来获得完成或承担的人才项目情况 -->
        <h4>（六）近五年来获得完成或承担的人才项目情况</h4>
        <el-table 
          :data="form.academicAchievements.talentProjects" 
          border 
          style="width: 100%; margin-bottom: 20px;"
          fit
          resizable
        >
          <el-table-column prop="source" label="来源部门/项目基金名称" min-width="30%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.source" 
                type="textarea" 
                placeholder="请输入来源部门"
                :autosize="{ minRows: 1, maxRows: 3 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="承担人才项目名称" min-width="30%">
            <template #default="{ row, $index }">
              <el-input 
                v-model="row.name" 
                type="textarea" 
                placeholder="请输入项目名称"
                :autosize="{ minRows: 1, maxRows: 3 }"
                resize="none"
              />
            </template>
          </el-table-column>
          <el-table-column prop="level" label="等级" min-width="15%">
            <template #default="{ row, $index }">
              <el-input v-model="row.level" placeholder="请输入等级" />
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="项目起止时间" min-width="15%">
            <template #default="{ row, $index }">
              <el-date-picker
                v-model="row.duration"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                format="YYYY.MM"
                value-format="YYYY-MM"
                style="width: 100%"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%" align="center">
            <template #default="{ row, $index }">
              <el-button @click="removeTalentProject($index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="addTalentProject" type="primary" style="margin-bottom: 20px;">添加人才项目</el-button>
        
        <!-- 附件上传 -->
        <div class="upload-section">
          <h4>相关附件</h4>
          <!-- 学术成果附件上传 -->
          <el-upload
            class="upload-demo"
            :show-file-list="false"
            :before-upload="beforeAttachmentUpload"
            :http-request="uploadAcademicDocument"
          >
            <el-button type="primary" size="small">上传附件（zip，≤100MB）</el-button>
          </el-upload>
          <!-- 学术成果附件下载 -->
          <div v-if="academicFileList.length > 0" style="margin-top: 10px;">
            <div v-for="file in academicFileList" :key="file.uid || file.id" class="file-list-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
              <el-button 
                @click="downloadFile(file.attachmentId, file.name)"
                type="text"
                size="small"
              >
                <el-icon><Download /></el-icon>
                {{ file.name }}
              </el-button>
              <el-button 
                @click="deleteFile(file.attachmentId, 'academic')"
                type="text"
                size="small"
                style="color: #f56c6c;"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <el-button @click="resetForm" size="large">重置</el-button>
        <el-button @click="exportData" size="large">导出JSON</el-button>
        <el-button type="primary" @click="submitForm" size="large">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Delete } from '@element-plus/icons-vue'
import { apiService } from '../api/index.js'

const formRef = ref()

// 附件文件列表
const academicFileList = ref([])

// 表单数据
const form = reactive({
  // 基本信息
  name: '',
  gender: '',
  birthDate: '',
  birthPlace: '',
  maritalStatus: '',
  politicalStatus: '',
  professionalTitle: '',
  idCard: '',
  phone: '',
  email: '',
  photo: '',
  
  // 最高学历学位
  highestEducation: '',
  highestDegree: '',
  
  // 家庭成员
  familyMembers: [],
  
  // 教育经历
  educationHistory: {
    attachment: '',
    records: []
  },
  
  // 工作经历
  workHistory: [],
  
  // 学术成果
  academicAchievements: {
    papers: [],
    projects: [],
    patents: [],
    books: [],
    achievements: [],
    talentProjects: []
  },
  
  // 附件
  attachments: {
    academic: ''
  }
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthDate: [
    { required: true, message: '请选择出生年月', trigger: 'change' }
  ],
  birthPlace: [
    { required: true, message: '请输入生源地', trigger: 'blur' }
  ],
  maritalStatus: [
    { required: true, message: '请选择婚姻情况', trigger: 'change' }
  ],
  politicalStatus: [
    { required: true, message: '请选择政治面貌', trigger: 'change' }
  ],
  idCard: [
    { required: true, message: '请输入身份证号码', trigger: 'blur' },
    { pattern: /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  highestEducation: [
    { required: true, message: '请选择最高学历', trigger: 'change' }
  ],
  highestDegree: [
    { required: true, message: '请选择最高学位', trigger: 'change' }
  ]
}

// 家庭成员操作
const addFamilyMember = () => {
  form.familyMembers.push({
    name: '',
    relationship: '',
    birthDate: '',
    politicalStatus: '',
    workplace: ''
  })
}

const removeFamilyMember = (index) => {
  form.familyMembers.splice(index, 1)
}

// 教育经历操作
const addEducation = () => {
  form.educationHistory.records.push({
    startDate: ['', ''], // 日期范围数组格式
    school: '',
    major: '',
    degree: '',
    mentor: ''
  })
}

const removeEducation = (index) => {
  form.educationHistory.records.splice(index, 1)
}

// 工作经历操作
const addWork = () => {
  form.workHistory.push({
    startDate: ['', ''], // 日期范围数组格式
    company: '',
    position: '',
    duties: ''
  })
}

const removeWork = (index) => {
  form.workHistory.splice(index, 1)
}

// 论文操作
const addPaper = () => {
  form.academicAchievements.papers.push({
    title: '',
    journal: '',
    publishDate: '',
    category: '',
    ranking: '',
    note: ''
  })
}

const removePaper = (index) => {
  form.academicAchievements.papers.splice(index, 1)
}

// 项目操作
const addProject = () => {
  form.academicAchievements.projects.push({
    name: '',
    funding: '',
    title: '',
    duration: ['', ''], // 日期范围数组格式
    role: ''
  })
}

const removeProject = (index) => {
  form.academicAchievements.projects.splice(index, 1)
}

// 专利操作
const addPatent = () => {
  form.academicAchievements.patents.push({
    type: '',
    name: '',
    grantDate: '',
    ranking: ''
  })
}

const removePatent = (index) => {
  form.academicAchievements.patents.splice(index, 1)
}

// 著作操作
const addBook = () => {
  form.academicAchievements.books.push({
    type: '',
    publisher: '',
    title: '',
    publishDate: '',
    ranking: ''
  })
}

const removeBook = (index) => {
  form.academicAchievements.books.splice(index, 1)
}

// 成果操作
const addAchievement = () => {
  form.academicAchievements.achievements.push({
    type: '',
    name: '',
    level: '',
    awardDate: '',
    ranking: ''
  })
}

const removeAchievement = (index) => {
  form.academicAchievements.achievements.splice(index, 1)
}

// 人才项目操作
const addTalentProject = () => {
  form.academicAchievements.talentProjects.push({
    source: '',
    name: '',
    level: '',
    duration: ['', ''] // 日期范围数组格式
  })
}

const removeTalentProject = (index) => {
  form.academicAchievements.talentProjects.splice(index, 1)
}

// 头像上传
const uploadAvatar = async (options) => {
  const { file, onSuccess, onError } = options
  
  try {
    const result = await apiService.upload.uploadAvatar(file)
    if (result.success) {
      form.photo = result.data.fileUrl
      onSuccess(result, file)
      ElMessage.success('头像上传成功!')
    } else {
      onError(new Error(result.message || '头像上传失败'))
      ElMessage.error(result.message || '头像上传失败!')
    }
  } catch (error) {
    onError(error)
    ElMessage.error('头像上传失败!')
  }
}

const handlePhotoSuccess = (response, file) => {
  // 成功回调已在uploadAvatar中处理
}

const beforePhotoUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片格式文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('上传头像图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 获取头像URL
const getPhotoUrl = (photoPath) => {
  if (!photoPath) return ''
  // 如果是完整URL，直接返回
  if (photoPath.startsWith('http')) return photoPath
  // 如果是相对路径，拼接基础URL
  return `http://localhost:3001${photoPath}`
}

// 通用附件上传函数
const uploadDocument = async (options, type) => {
  const { file, onSuccess, onError } = options
  try {
    // 只处理 academic 类型，后续如有其他类型可扩展
    let oldAttachmentId = ''
    if (type === 'academic' && form.attachments && form.attachments.academic) {
      oldAttachmentId = form.attachments.academic
    }
    // 如果已有附件，先删除原有附件
    if (oldAttachmentId) {
      try {
        await apiService.upload.deleteFile(oldAttachmentId)
        console.log(`已删除原有附件`)
      } catch (deleteError) {
        // 删除失败仅打印，不提示，不阻塞
        console.warn(`删除原有附件失败:`, deleteError)
      }
    }
    // 上传新附件
    const result = await apiService.upload.uploadDocument(file, type)
    if (result.success) {
      form.attachments.academic = result.data.attachmentId
      academicFileList.value = [{
        name: "所有附件.zip",
        url: result.data.fileUrl,
        attachmentId: result.data.attachmentId
      }]
      onSuccess(result, file)
      ElMessage.success(`附件上传成功!`)
      await apiService.resume.createOrUpdateProfile(form)
    } else {
      onError(new Error(result.message || '附件上传失败'))
      ElMessage.error(result.message || '附件上传失败!')
    }
  } catch (error) {
    onError(error)
    ElMessage.error('附件上传失败!')
  }
}
// 学术成果附件上传
const uploadAcademicDocument = (options) => {
  return uploadDocument(options, 'academic')
}


const beforeAttachmentUpload = (file) => {
  const isZip = file.type === 'application/zip' || file.name.endsWith('.zip')
  const isLt100M = file.size / 1024 / 1024 < 100

  if (!isZip) {
    ElMessage.error('只能上传zip格式文件!')
    return false
  }
  if (!isLt100M) {
    ElMessage.error('上传文件大小不能超过 100MB!')
    return false
  }
  return true
}

// 文件下载
const downloadFile = async (attachmentId, fileName) => {
  try {
    const response = await apiService.upload.downloadFile(attachmentId)
    
    // 检查响应是否为文件不存在的错误
    if (response && response.success === false && response.message === "文件不存在") {
      // 自动删除显示的附件
      autoRemoveNonExistentFile(attachmentId)
      ElMessage.error('文件不存在，已自动清除')
      return
    }
    
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('文件下载成功!')
  } catch (error) {
    console.error('下载失败:', error)
    
    // 检查错误响应是否为文件不存在
    if (error.response && error.response.data) {
      const errorData = error.response.data
      if (errorData.success === false && errorData.message === "文件不存在") {
        autoRemoveNonExistentFile(attachmentId)
        ElMessage.error('文件不存在，已自动清除')
        return
      }
    }
    
    ElMessage.error('文件下载失败!')
  }
}

// 验证并加载附件
const validateAndLoadAttachment = async (attachmentId, type, fileName) => {
  try {
    // 尝试获取文件信息来验证文件是否存在
    const response = await apiService.upload.downloadFile(attachmentId)
    
    if (type === 'academic') {
      academicFileList.value = [{
        name: fileName,
        url: '#',
        attachmentId: attachmentId
      }]
    }
  } catch (error) {
    console.warn(`附件 ${attachmentId} 验证失败:`, error)
    
    // 检查是否为文件不存在的错误
    let isFileNotFound = false
    
    if (error.response && error.response.data) {
      const errorData = error.response.data
      if (errorData.success === false && errorData.message === "文件不存在") {
        isFileNotFound = true
      }
    }
    
    // 如果文件不存在，自动清除
    if (isFileNotFound) {
      console.log(`文件 ${attachmentId} 不存在，自动清除`)
      autoRemoveNonExistentFile(attachmentId)
    }
  }
}

// 自动删除不存在的文件
const autoRemoveNonExistentFile = (attachmentId) => {
  // 防御式处理，保证 form.attachments 一定为对象
  if (!form.attachments || typeof form.attachments !== 'object') {
    form.attachments = { academic: '' }
  }
  // 检查学术成果附件
  if (form.attachments.academic === attachmentId) {
    form.attachments.academic = ''
    academicFileList.value = []
    console.log('已自动清除学术成果附件')
  }
  // 保存更新后的数据到服务器
  saveProfileSilently()
}

// 静默保存简历数据（不显示成功消息）
const saveProfileSilently = async () => {
  try {
    // 使用统一的日期格式处理
    const processedData = processSubmitData(form)
    await apiService.resume.createOrUpdateProfile(processedData)
    console.log('简历数据已静默更新')
  } catch (error) {
    console.error('静默保存失败:', error)
  }
}

// 文件删除
const deleteFile = async (attachmentId, type) => {
  try {
    // 确认删除
    const confirmResult = await ElMessageBox.confirm(
      '确定要删除此文件吗？删除后无法恢复。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (confirmResult !== 'confirm') {
      return
    }
    
    const response = await apiService.upload.deleteFile(attachmentId)
    if (response.success) {
      // 根据类型清空对应的附件ID和文件列表
      if (type === 'education') {
        form.educationHistory.attachment = ''
        educationFileList.value = []
      } else if (type === 'academic') {
        form.attachments.academic = ''
        academicFileList.value = []
      }
      
      ElMessage.success('文件删除成功!')
    } else {
      // 检查是否为文件不存在的错误
      if (response.message === "文件不存在") {
        // 自动删除显示的附件
        autoRemoveNonExistentFile(attachmentId)
        ElMessage.warning('文件不存在，已自动清除')
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    }
  } catch (error) {
    if (error === 'cancel') {
      // 用户取消删除
      return
    }
    console.error('删除失败:', error)
    
    // 检查错误响应是否为文件不存在
    if (error.response && error.response.data) {
      const errorData = error.response.data
      if (errorData.success === false && errorData.message === "文件不存在") {
        autoRemoveNonExistentFile(attachmentId)
        ElMessage.warning('文件不存在，已自动清除')
        return
      }
    }
    
    ElMessage.error('文件删除失败!')
  }
}

// 将对象转换为数组的辅助函数
const objectToArray = (obj) => {
  if (!obj || typeof obj !== 'object') return []
  return Object.keys(obj).map(key => obj[key])
}

// 处理日期范围数据
const processDateRange = (dateData) => {
  return [dateData["0"], dateData["1"]];// 默认空值
}

// 加载已保存的简历
const loadProfile = async () => {
  try {
    // 模拟加载我们的测试数据
    const res = await apiService.resume.getProfile() // 假设这是获取简历的 API 调用
    if (res.success) {
      // 确保数据结构正确初始化
      const data = res.data
      console.log('加载的数据:', data) // 调试用
      
      // 基本信息
      Object.assign(form, {
        name: data.name || '',
        gender: data.gender || '',
        birthDate: data.birthDate || '',
        birthPlace: data.birthPlace || '',
        maritalStatus: data.maritalStatus || '',
        politicalStatus: data.politicalStatus || '',
        professionalTitle: data.professionalTitle || '',
        idCard: data.idCard || '',
        phone: data.phone || '',
        email: localStorage.getItem('email') || '', // 固定从localStorage获取
        photo: data.photo || '',
        highestEducation: data.highestEducation || '',
        highestDegree: data.highestDegree || ''
      })
      
      // 处理家庭成员 - 将对象转换为数组
      form.familyMembers = objectToArray(data.familyMembers)
      
      // 处理工作经历 - 将对象转换为数组，并处理日期范围
      if (data.workHistory) {
        form.workHistory = objectToArray(data.workHistory).map(work => {
          console.log('工作经历原始日期数据:', work.startDate)
          const processedDate = processDateRange(work.startDate)
          console.log('工作经历处理后日期:', processedDate)
          return {
            ...work,
            startDate: processedDate
          }
        })
      }
      
      // 处理教育经历
      if (data.educationHistory) {
        form.educationHistory = {
          records: objectToArray(data.educationHistory.records).map(edu => {
            console.log('教育经历原始日期数据:', edu.startDate)
            const processedDate = processDateRange(edu.startDate)
            console.log('教育经历处理后日期:', processedDate)
            return {
              ...edu,
              startDate: processedDate
            }
          })
        }
      }
      
      // 处理学术成果
      if (data.academicAchievements) {
        form.academicAchievements = {
          papers: objectToArray(data.academicAchievements.papers),
          projects: objectToArray(data.academicAchievements.projects).map(project => {
            console.log('项目原始日期数据:', project.duration)
            const processedDate = processDateRange(project.duration)
            console.log('项目处理后日期:', processedDate)
            return {
              ...project,
              duration: processedDate
            }
          }),
          patents: objectToArray(data.academicAchievements.patents),
          books: objectToArray(data.academicAchievements.books),
          achievements: objectToArray(data.academicAchievements.achievements),
          talentProjects: objectToArray(data.academicAchievements.talentProjects).map(talent => {
            console.log('人才项目原始日期数据:', talent.duration)
            const processedDate = processDateRange(talent.duration)
            console.log('人才项目处理后日期:', processedDate)
            return {
              ...talent,
              duration: processedDate
            }
          })
        }
      }
      
      // 附件
      // 保证 form.attachments 始终为对象类型
      form.attachments = data.attachments;      
      // 加载附件列表并验证文件是否存在
      if (form.attachments.academic) {
        console.log('加载学术成果附件:', form.attachments.academic);
        await validateAndLoadAttachment(form.attachments.academic, 'academic', '所有附件.zip')
      }
      
      console.log('处理后的表单数据:', form) // 调试用
    }
  } catch (error) {
    console.error('加载简历失败:', error)
  }
}
    onMounted(() => {
      // 设置固定的用户邮箱
      form.email = localStorage.getItem('email') || ''
      loadProfile()
    })


// 表单提交
const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const result = await apiService.resume.createOrUpdateProfile(form)
        if (result.success) {
          ElMessage.success('简历保存成功!')
        } else {
          ElMessage.error(result.message || '保存失败')
        }
      } catch (error) {
        console.error('保存简历失败:', error)
        ElMessage.error('保存失败，请重试!')
      }
    } else {
      ElMessage.error('请完善表单信息!')
    }
  })
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
  // 重置数组数据
  form.familyMembers = []
  form.educationHistory = {
    attachment: '',
    records: []
  }
  form.workHistory = []
  form.academicAchievements = {
    papers: [],
    projects: [],
    patents: [],
    books: [],
    achievements: [],
    talentProjects: []
  }
  form.attachments = {
    academic: ''
  }
  form.photo = ''
  form.highestEducation = ''
  form.highestDegree = ''
  // 重置时恢复localStorage中的email
  form.email = localStorage.getItem('email') || ''
  educationFileList.value = []
  academicFileList.value = []
  
  // 重置上传状态
  uploadLoading.value.education = false
  uploadLoading.value.academic = false
  uploadProgress.value.education = 0
  uploadProgress.value.academic = 0
}
// 导出数据为JSON
const exportData = () => {
  try {
    // 使用与提交相同的数据处理逻辑
    const processedData = form
    
    // 添加导出元数据
    const exportData = {
      ...processedData,
      exportTime: new Date().toISOString(),
      exportVersion: '1.0'
    }
    
    console.log('导出的数据:', exportData)
    
    // 转换为JSON字符串
    const jsonString = JSON.stringify(exportData, null, 2)
    
    // 创建下载链接
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    // 生成文件名（包含姓名和时间戳）
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
    const fileName = `简历数据_${form.name || '未命名'}_${timestamp}.json`
    
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('数据导出成功!')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('数据导出失败!')
  }
}
</script>

<style scoped>
.registration-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color:#fbfbfb;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 15px;
}

.form-header h2 {
  color: #409EFF;
  margin: 0;
  font-size: 24px;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.form-section {
  margin-bottom: 30px;
  border: 1px solid #f4f6f8;
  border-radius: 8px;
  padding: 20px;
}

.form-section h3 {
  color: #409EFF;
  margin: 0 0 20px 0;
  font-size: 18px;
  border-bottom: 1px solid #E4E7ED;
  padding-bottom: 10px;
}

.form-section h4 {
  color: #606266;
  margin: 20px 0 10px 0;
  font-size: 16px;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 160px;
  display: block;
  object-fit: cover;
}

.photo-label {
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.form-actions {
  text-align: center;
  padding: 30px 0;
  border-top: 1px solid #E4E7ED;
  margin-top: 30px;
}

.form-actions .el-button {
  margin: 0 10px;
  padding: 12px 30px;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input__inner) {
  font-size: 14px;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-table th) {
  background-color: #F5F7FA;
  font-weight: 500;
}

:deep(.el-table td) {
  padding: 8px 0;
}

:deep(.el-button--small) {
  padding: 5px 10px;
  font-size: 12px;
}

/* 表格中textarea的样式优化 */
:deep(.el-table .el-textarea__inner) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

:deep(.el-table .el-textarea__inner:focus) {
  border-color: #409EFF;
  outline: none;
}

:deep(.el-table .el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

/* 确保表格行高度自适应 */
:deep(.el-table td) {
  padding: 8px 0;
  vertical-align: top;
}

:deep(.el-table .cell) {
  padding: 0 8px;
}

/* 上传进度条样式 */
:deep(.el-progress-bar) {
  padding-right: 50px;
  margin-right: -50px;
}

:deep(.el-progress__text) {
  font-size: 12px;
  color: #409EFF;
  font-weight: 500;
}

:deep(.el-progress-bar__outer) {
  background-color: #ebeef5;
  border-radius: 10px;
}

:deep(.el-progress-bar__inner) {
  background: linear-gradient(90deg, #409EFF 0%, #79bbff 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
}

/* 上传按钮状态样式 */
:deep(.el-button--primary.is-loading) {
  background-color: #79bbff;
  border-color: #79bbff;
}

:deep(.el-upload__input) {
  display: none !important;
}

/* 文件列表样式优化 */
.file-list-item {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.file-list-item:hover {
  background-color: #e9ecef;
  border-color: #409EFF;
}

.upload-section {
  background-color: #fafbfc;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 16px;
  margin-top: 16px;
}

.upload-section h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #409EFF;
  font-size: 14px;
  font-weight: 600;
}
</style>
