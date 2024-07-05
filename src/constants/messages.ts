import { PostCategory } from '~/constants/enums'
import { stringEnumToArray } from '~/utils/commons'

export const USERS_MESSAGES = {
    VALIDATION_ERROR: 'Bạn cung cấp dữ liệu chưa hợp lệ',
    NAME_IS_REQUIRED: 'Tên là bắt buộc',
    NAME_MUST_BE_A_STRING: 'Tên phải là chuỗi',
    NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Độ dài tên phải từ 1 đến 100 ký tự',
    USERNAME_IS_REQUIRED: 'Tên đăng nhập là bắt buộc',
    USERNAME_ALREADY_EXISTS: 'Tên đăng nhập đã tồn tại',
    USERNAME_NOT_FOUND: 'Tên đăng nhập không tồn tại',
    PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc',
    PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là chuỗi',
    PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Độ dài mật khẩu phải từ 6 đến 50 ký tự',
    PASSWORD_MUST_BE_STRONG:
        'Mật khẩu chưa đủ mạnh, phải chứa ít nhất 6 ký tự, 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
    INCORRECT_PASSWORD: 'Mật khẩu không chính xác',
    CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu là bắt buộc',
    CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là chuỗi',
    CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Độ dài xác nhận mật khẩu phải từ 6 đến 50 ký tự',
    CONFIRM_PASSWORD_MUST_BE_STRONG: 'Xác nhận mật khẩu chưa đủ mạnh',
    CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Xác nhận mật khẩu phải giống với mật khẩu',
    SEX_IS_INVALID: 'Giới tính không hợp lệ',
    USER_IS_NOT_ACTIVE: 'Người dùng đã bị khóa tài khoản',
    ACCESS_TOKEN_IS_REQUIRED: 'Access token là bắt buộc',
    REFRESH_TOKEN_IS_REQUIRED: 'Refresh token là bắt buộc',
    USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Refresh token đã được sử dụng hoặc không tồn tại',
    PROFILE_NOT_FOUND: 'Không tìm thấy thông tin người dùng',
    PERMISSION_DENIED: 'Không có quyền truy cập',
    IS_ACTIVE_MUST_BE_A_BOOLEAN: 'Trạng thái kích hoạt phải là boolean',
    USER_NOT_FOUND: 'Người dùng không tồn tại',

    REGISTER_SUCCESSFULLY: 'Đăng ký thành công',
    LOGIN_SUCCESSFULLY: 'Đăng nhập thành công',
    REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token thành công',
    LOGOUT_SUCCESSFULLY: 'Đăng xuất thành công',
    GET_MY_INFO_SUCCESSFULLY: 'Lấy thông tin của tôi thành công',
    GET_PROFILE_SUCCESSFULLY: 'Lấy thông tin người dùng thành công',
    UPDATE_AVATAR_SUCCESSFULLY: 'Cập nhật ảnh đại diện thành công',
    UPDATE_ME_SUCCESSFULLY: 'Cập nhật thông tin cá nhân thành công',
    GET_ALL_USERS_SUCCESSFULLY: 'Lấy tất cả người dùng thành công',
    UPDATE_IS_ACTIVE_SUCCESSFULLY: 'Cập nhật trạng thái kích hoạt thành công'
}

export const MEDIAS_MESSAGES = {
    INVALID_FILE_TYPE: 'File không hợp lệ',
    NO_IMAGE_PROVIDED: 'Không có ảnh nào được cung cấp',

    UPLOAD_IMAGE_SUCCESSFULLY: 'Tải ảnh lên thành công'
}

export const POSTS_MESSAGES = {
    VERIFY_ACCESS_TOKEN_MUST_BE_A_BOOLEAN: 'Xác thực access token phải là boolean',
    TITLE_IS_REQUIRED: 'Tiêu đề bài viết là bắt buộc',
    TITLE_MUST_BE_A_STRING: 'Tiêu đề bài viết phải là chuỗi',
    TITLE_LENGTH_MUST_BE_FROM_1_TO_200: 'Độ dài tiêu đề bài viết phải từ 1 đến 200 ký tự',
    NO_IMAGE_PROVIDED: 'Không có ảnh nào được cung cấp',
    IMAGE_MUST_BE_A_STRING: 'Ảnh bài viết phải là chuỗi',
    IMAGE_NOT_FOUND: 'Không tìm thấy ảnh',
    CONTENT_IS_REQUIRED: 'Nội dung bài viết là bắt buộc',
    CONTENT_MUST_BE_A_STRING: 'Nội dung bài viết phải là chuỗi',
    CATEGORY_MUST_BE_A_STRING: 'Danh mục bài viết phải là chuỗi',
    CATEGORY_MUST_BE_IN_VALUES: `Danh mục phải thuộc một trong các giá trị: ${stringEnumToArray(PostCategory).join(', ')}`,
    AUTHOR_IS_REQUIRED: 'Tác giả bài viết là bắt buộc',
    AUTHOR_MUST_BE_A_STRING: 'Tác giả bài viết phải là chuỗi',
    APPROVED_MUST_BE_A_BOOLEAN: 'Trạng thái duyệt bài viết phải là boolean',
    MY_POSTS_MUST_BE_A_BOOLEAN: 'My_posts phải là boolean',
    INVALID_POST_ID: 'ID bài viết không hợp lệ',
    POST_NOT_FOUND: 'Bài viết không tồn tại',
    NOT_HAVE_PERMISSION: 'Không có quyền hạn',
    SLUG_MUST_BE_A_STRING: 'Slug bài viết phải là chuỗi',

    CREATE_POST_SUCCESSFULLY: 'Tạo bài viết thành công',
    GET_ALL_POSTS_SUCCESSFULLY: 'Lấy tất cả bài viết thành công',
    GET_MY_POSTS_SUCCESSFULLY: 'Lấy bài viết của tôi thành công',
    UPDATE_APPROVE_STATUS_SUCCESSFULLY: 'Cập nhật trạng thái duyệt bài viết thành công',
    UPDATE_POST_SUCCESSFULLY: 'Cập nhật bài viết thành công',
    DELETE_POST_SUCCESSFULLY: 'Xóa bài viết thành công',
    GET_POST_SUCCESSFULLY: 'Lấy thông tin bài viết thành công'
}

export const CONTACT_MESSAGES = {
    VERIFY_ACCESS_TOKEN_MUST_BE_A_BOOLEAN: 'Xác thực access token phải là boolean',
    NAME_IS_REQUIRED: 'Tên là bắt buộc',
    NAME_MUST_BE_A_STRING: 'Tên phải là chuỗi',
    NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Độ dài tên phải từ 1 đến 100 ký tự',
    PHONE_NUMBER_IS_REQUIRED: 'Số điện thoại là bắt buộc',
    PHONE_NUMBER_IS_INVALID: 'Số điện thoại không hợp lệ',
    EMAIL_IS_REQUIRED: 'Email là bắt buộc',
    EMAIL_IS_INVALID: 'Email không hợp lệ',
    CONTENT_IS_REQUIRED: 'Nội dung là bắt buộc',
    CONTENT_MUST_BE_A_STRING: 'Nội dung phải là chuỗi',
    IS_READ_IS_REQUIRED: 'Trạng thái đọc là bắt buộc',
    IS_READ_MUST_BE_A_BOOLEAN: 'Trạng thái đọc phải là boolean',
    CONTACT_ID_IS_REQUIRED: 'ID liên hệ là bắt buộc',
    INVALID_CONTACT_ID: 'ID liên hệ không hợp lệ',
    CONTACT_NOT_FOUND: 'Liên hệ không tồn tại',

    CREATE_CONTACT_SUCCESSFULLY: 'Tạo liên hệ thành công',
    GET_ALL_CONTACTS_SUCCESSFULLY: 'Lấy tất cả liên hệ thành công',
    UPDATE_IS_READ_STATUS_SUCCESSFULLY: 'Cập nhật trạng thái đọc liên hệ thành công'
}
