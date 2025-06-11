-- Cập nhật mật khẩu mặc định cho Staff (sử dụng SHA256 hash của '123456')
UPDATE Staff
SET PasswordHash = 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=';

-- Cập nhật mật khẩu mặc định cho Student (sử dụng SHA256 hash của '123456')
UPDATE Student
SET Password = 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=';

-- Cập nhật mật khẩu mặc định cho Parent (sử dụng SHA256 hash của '123456')
UPDATE Parent
SET Password = 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI='; 