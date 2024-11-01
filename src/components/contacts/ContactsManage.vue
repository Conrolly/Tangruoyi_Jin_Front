<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-button
          type="primary"
          style="margin-left: 5px; font-size: 18px"
          @click="add"
      >
        新增
      </el-button
      >
    </div>
    <el-table
        :data="tableData"
        :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
        border
        highlight-current-row
        @current-change="selectCurrentChange"
    >
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="firstName" label="联系人的名字" width="260">
      </el-table-column>
      <el-table-column prop="lastName" label="联系人的姓氏" width="250">
      </el-table-column>
      <el-table-column prop="phone" label="电话号码" width="250">
      </el-table-column>
      <el-table-column prop="email" label="电子邮箱地址" width="250">
      </el-table-column>
      <el-table-column prop="address" label="居住地址">
      </el-table-column>
      <el-table-column
          prop="operate"
          label="操作"
          fixed="right"
          width="240"
      >
        <template slot-scope="scope">
          <el-button
              type="success"
              @click="mod(scope.row)"
              style="font-size: 18px"
          >
            编辑
          </el-button
          >
          <el-popconfirm
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
              style="margin-left: 5px"
          >
            <el-button
                slot="reference"
                type="danger"
                style="font-size: 18px"
            >
              删除
            </el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    >
    </el-pagination>

    <el-dialog
        title="新增"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="180px">
        <el-form-item label="联系人的名字" prop="name">
          <el-col :span="20">
            <el-input v-model="form.firstName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="联系人的姓氏" prop="name">
          <el-col :span="20">
            <el-input v-model="form.lastName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="电话号码" prop="name">
          <el-col :span="20">
            <el-input v-model="form.phone"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="电子邮箱地址" prop="name">
        <el-col :span="20">
          <el-input v-model="form.email"
          ></el-input>
        </el-col>
        </el-form-item>
        <el-form-item label="居住地址" prop="name">
        <el-col :span="20">
          <el-input v-model="form.address"
          ></el-input>
        </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button
                    @click="centerDialogVisible = false"
                    style="font-size: 18px"
                >
                    取 消</el-button
                >
                <el-button type="primary" @click="save" style="font-size: 18px"
                >
                    确 定</el-button
                >
            </span>
    </el-dialog>
  </div>
</template>


<script>

export default {
  name: "ContactsManage",
  data() {
    let checkCount = (rule, value, callback) => {
      if (value > 9999) {
        callback(new Error("数量输入过大"));
      } else {
        callback();
      }
    };

    return {
      user: JSON.parse(sessionStorage.getItem("CurUser")),
      storageData: [],
      goodstypeData: [],
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      name: "",
      storage: "",
      goodstype: "",
      centerDialogVisible: false,
      inDialogVisible: false,
      innerVisible: false,
      currentRow: {},
      tempUser: {},
      form: {
        id: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
      },
      rules1: {},
      rules: {
        firstName: [
          {
            required: true,
            message: "请输入名字",
            trigger: "blur",
          },
        ],
        lastName: [
          {
            required: true,
            message: "请输入姓氏",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    doSelectUser(val) {
      console.log(val);
      this.tempUser = val;
    },
    selectCurrentChange(val) {
      this.currentRow = val;
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    del(id) {
      console.log(id);

      this.$axios
          .get(this.$httpUrl + "/contacts/del?id=" + id)
          .then((res) => res.data)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.$message({
                message: "操作成功！",
                type: "success",
              });
              this.loadPost();
            } else {
              this.$message({
                message: "操作失败！",
                type: "error",
              });
            }
          });
    },
    mod(row) {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        //赋值到表单
        this.form.id = row.id;
        this.form.firstName = row.firstName;
        this.form.lastName = row.lastName;
        this.form.phone = row.phone;
        this.form.email = row.email;
        this.form.address = row.address;
      });
    },
    add() {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.resetForm();

        this.form.id = "";
      });
    },
    selectUser() {
      this.innerVisible = true;
    },
    doSave() {
      this.$axios
          .post(this.$httpUrl + "/contacts/save", this.form)
          .then((res) => res.data)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.$message({
                message: "操作成功！",
                type: "success",
              });
              this.centerDialogVisible = false;
              this.loadPost();
              this.resetForm();
            } else {
              this.$message({
                message: "操作失败！",
                type: "error",
              });
            }
          });
    },
    doMod() {
      this.$axios
          .post(this.$httpUrl + "/contacts/update", this.form)
          .then((res) => res.data)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.$message({
                message: "操作成功！",
                type: "success",
              });
              this.centerDialogVisible = false;
              this.loadPost();
              this.resetForm();
            } else {
              this.$message({
                message: "操作失败！",
                type: "error",
              });
            }
          });
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.doMod();
          } else {
            this.doSave();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1;
      this.pageSize = val;
      this.loadPost();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.loadPost();
    },
    resetParam() {
      this.name = "";
      this.storage = "";
      this.goodstype = "";
    },
    loadPost() {
      this.$axios
          .post(this.$httpUrl + "/contacts/listPage", {
            pageSize: this.pageSize,
            pageNum: this.pageNum,
            param: {
              name: this.name,
              goodstype: this.goodstype + "",
              storage: this.storage + "",
            },
          })
          .then((res) => res.data)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.tableData = res.data;
              this.total = res.total;
            } else {
              alert("获取数据失败");
            }
          });
    },
    loadStorage() {
      this.$axios
          .get(this.$httpUrl + "/storage/list")
          .then((res) => res.data)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.storageData = res.data;
            } else {
              alert("获取数据失败");
            }
          });
    },
    loadGoodstype() {
      this.$axios
          .get(this.$httpUrl + "/goodstype/list")
          .then((res) => res.data)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.goodstypeData = res.data;
            } else {
              alert("获取数据失败");
            }
          });
    },
  },
  beforeMount() {
    this.loadStorage();
    this.loadGoodstype();
    this.loadPost();
  },
};
</script>

<style scoped>
</style>
