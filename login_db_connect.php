<?php
//用于登录界面数据库连接
//设置字符集
header('Content-type:text/html;charset=utf8');

//连接数据库
$con=mysqli_connect("localhost","root","Huawei@123","LMS");//此处root为登录mysql的用户名，其后依此是密码与数据库名称
if (mysqli_connect_errno($con))
{
    echo "连接 MySQL 失败: " . mysqli_connect_error();
} 
R