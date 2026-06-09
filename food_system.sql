CREATE DATABASE food_system;

USE food_system;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE restaurant (
    res_id INT AUTO_INCREMENT PRIMARY KEY,
    res_name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    `desc` VARCHAR(500)
);

CREATE TABLE food_type (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL
);

CREATE TABLE food (
    food_id INT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    price FLOAT,
    `desc` VARCHAR(500),
    type_id INT,
    FOREIGN KEY (type_id) REFERENCES food_type(type_id)
);

CREATE TABLE sub_food (
    sub_id INT AUTO_INCREMENT PRIMARY KEY,
    sub_name VARCHAR(255) NOT NULL,
    sub_price FLOAT,
    food_id INT,
    FOREIGN KEY (food_id) REFERENCES food(food_id)
);

CREATE TABLE rate_res (
    user_id INT,
    res_id INT,
    amount INT,
    date_rate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, res_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (res_id) REFERENCES restaurant(res_id)
);

-- 7. Bảng Like_res (Yêu thích nhà hàng)
CREATE TABLE like_res (
    user_id INT,
    res_id INT,
    date_like DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, res_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (res_id) REFERENCES restaurant(res_id)
);

CREATE TABLE `order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    food_id INT,
    amount INT,
    code VARCHAR(50),
    arr_sub_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (food_id) REFERENCES food(food_id)
);

-- 1. Thêm User
INSERT INTO
    user (full_name, email, password)
VALUES
    ('Nguyễn Văn A', 'a@gmail.com', '123'),
    ('Trần Thị B', 'b@gmail.com', '123'),
    ('Lê Văn C', 'c@gmail.com', '123'),
    ('Phạm Thị D', 'd@gmail.com', '123'),
    ('Hoàng Văn E', 'e@gmail.com', '123'),
    ('Người Dùng Mới', 'moi@gmail.com', '123');

-- User này dùng để test trường hợp không hoạt động
-- 2. Thêm Nhà hàng
INSERT INTO
    restaurant (res_name, image, `desc`)
VALUES
    (
        'Nhà hàng Cơm Tấm',
        'comtam.jpg',
        'Cơm tấm sườn bì chả ngon tuyệt'
    ),
    (
        'Quán Phở Hà Nội',
        'pho.jpg',
        'Phở truyền thống gia truyền'
    ),
    (
        'Bún Đậu Mắm Tôm',
        'bundau.jpg',
        'Đặc sản miền Bắc'
    );

-- 3. Thêm Loại món ăn
INSERT INTO
    food_type (type_name)
VALUES
    ('Món chính'),
    ('Đồ uống'),
    ('Món ăn vặt');

-- 4. Thêm Món ăn (Food)
INSERT INTO
    food (food_name, image, price, `desc`, type_id)
VALUES
    (
        'Cơm tấm sườn',
        'suon.jpg',
        45000,
        'Sườn nướng than hoa',
        1
    ),
    (
        'Phở bò tái',
        'pho.jpg',
        50000,
        'Nước dùng thanh ngọt',
        1
    ),
    (
        'Trà đào cam sả',
        'tra.jpg',
        30000,
        'Giải khát mùa hè',
        2
    );

-- 5. Thêm Món phụ (Topping)
INSERT INTO
    sub_food (sub_name, sub_price, food_id)
VALUES
    ('Trứng ốp la', 10000, 1),
    ('Bì chả', 15000, 1),
    ('Quẩy giòn', 5000, 2);

-- 6. Thêm Đánh giá (Rate)
INSERT INTO
    rate_res (user_id, res_id, amount)
VALUES
    (1, 1, 5),
    (2, 1, 4),
    (3, 2, 5);

-- 7. Thêm Lượt yêu thích (Like)
INSERT INTO
    like_res (user_id, res_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 1);

-- User 1 like 2 nhà hàng, User 1,2,3,4,5 like Cơm Tấm
-- 8. Thêm Đơn hàng (Order)
INSERT INTO
    `order` (user_id, food_id, amount, code, arr_sub_id)
VALUES
    (1, 1, 1, 'DH001', '1,2'),
    (2, 2, 2, 'DH002', '3'),
    (3, 1, 1, 'DH003', '1');

-- BT1: Tìm 5 người đã like nhà hàng nhiều nhất
SELECT
    u.full_name,
    COUNT(l.res_id) AS like_count
FROM
    user u
    JOIN like_res l ON u.user_id = l.user_id
GROUP BY
    u.user_id
ORDER BY
    like_count DESC
LIMIT
    5;

-- BT2: Tìm 2 nhà hàng có lượt like nhiều nhất
SELECT
    r.res_name,
    COUNT(l.user_id) AS like_count
FROM
    restaurant r
    JOIN like_res l ON r.res_id = l.res_id
GROUP BY
    r.res_id
ORDER BY
    like_count DESC
LIMIT
    2;

-- BT3: Tìm người đã đặt hàng nhiều nhất
SELECT
    u.full_name,
    COUNT(o.order_id) AS order_count
FROM
    user u
    JOIN `order` o ON u.user_id = o.user_id
GROUP BY
    u.user_id
ORDER BY
    order_count DESC
LIMIT
    1;

-- BT4: Tìm người dùng không hoạt động (không đặt hàng, không like, không rate)
SELECT
    u.user_id,
    u.full_name
FROM
    user u
    LEFT JOIN `order` o ON u.user_id = o.user_id
    LEFT JOIN like_res l ON u.user_id = l.user_id
    LEFT JOIN rate_res r ON u.user_id = r.user_id
WHERE
    o.order_id IS NULL
    AND l.res_id IS NULL
    AND r.res_id IS NULL;