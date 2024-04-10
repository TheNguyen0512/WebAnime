import mysql.connector

# Kết nối vào cơ sở dữ liệu
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="webanime"
)

# Tạo con trỏ
mycursor = mydb.cursor()

# Đọc dữ liệu nhị phân từ tệp hình ảnh
with open(r'C:\Users\Nguyen\Downloads\You-Zitsu_Tomoseshunsaku_2nd_Art_Works_cover.jpg', 'rb') as file:
    img_data = file.read()

# Cập nhật hình ảnh vào cơ sở dữ liệu
sql = "UPDATE anime SET ani_img = %s WHERE id = %s"
val = (img_data, 5)  # Thay đổi id tương ứng với dòng bạn muốn cập nhật
mycursor.execute(sql, val)

mydb.commit()

print(mycursor.rowcount, "dòng đã được cập nhật")
