## Cách chạy project

- Backend:
  - Vào thư mục backend, chạy terminal: pocketbase serve
- Frontend:
  - Vào thư mục frontend, chạy terminal: npm run dev

## Folders

- Frontend:
  - src:
    - common: Thư mục dùng để xài chung các custom components.
      - axios: Thư mục config axios.
      - pagination: Sử dụng pagination.
    - component: Thư mục thao tác các màn hình về product
    - hooks: Thư mục sử dụng useQuery function gọi data.
    - models: Thư mục lưu interface typescript.
    - utils: Thư mục lưu hàm gọi api vào thao tác function dùng chung.

## React Query là gì?

TanStack Query (tên mới) hay React Query là thư viện giúp quản lý các state bất đồng bộ như data từ api.

Sức mạnh của Tanstack Query

- Quản lý cache data và cập nhật cực kỳ đơn giản với zero config
- Không dùng global state, reducer để quản lý, không học thuật khó hiểu.
- Có khả năng tương thích và mở rộng với mọi use-case

Từ khi biết đến Tanstack Query, mình đã tiết kiệm được thời gian code và sản phẩm cũng đem lại trải nghiệm người dùng tốt hơn.

Trả lời câu hỏi phổ biến:

Tanstack Query dùng gì để gọi API?

Tanstack Query không đảm nhận việc gọi API, việc gọi API sẽ thực hiện thông qua các thư viện bạn dùng như axios, fetch API. Còn Tanstack Query chỉ đảm nhận việc quản lý data và trigger khi cần thiết.

## Một số khái niệm quan trọng

- `staleTime` (default `0` ms): Thời gian data được cho là đã cũ. Khi get data xong thì sau một thời gian bạn quy định thì data nó sẽ tự cũ. **Lưu ý cái `stale` trên dev tool nó hiển thị là data của bạn `stale` và `active`**
- `cacheTime` (default `5*60*1000` ms tức 5 phút): Thời gian data sẽ bị xóa ra khỏi bộ nhớ đệm. Có thể data đã "cũ" nhưng nó chưa bị xóa ra khỏi bộ nhớ đệm vì bạn set `staleTime < cacheTime`. Thường thì người ta sẽ set `staleTime < cacheTime`
- `inactive`: là khi data đó không còn component nào subcribe cả

```tsx
const result = useQuery({ queryKey: ["todos"], queryFn: fetchTodoList });
```

`result` là một object chứa một vài state rất quan trọng: `status`, `fetchStatus`,...

Những state về các khoảnh khắc của data

- `isLoading` or `status === 'loading'` - Query chưa có data
- `isError` or `status === 'error'` - Query xảy ra lỗi
- `isSuccess` or `status === 'success'` - Query thành công và data đã có sẵn

Những state về data

- `error` - Nếu `isError === true` thì `error` sẽ xuất hiện ở đây
- `data` - Nếu `isSuccess === true` thì `data` sẽ xuất hiện ở đây

Đặc biệt là `fetchStatus`

- `isFetching` or `fetchStatus === 'fetching'` - Đang fetching API.
- `isPaused` or `fetchStatus === 'paused'` - Query muốn fetch API nhưng bị tạm dừng vì một lý do nào đó.
- `fetchStatus === 'idle'` - Query không làm gì cả

### Nếu thấy quá rối vì quá nhiều trạng thái, sự khác nhau giữa `status` và `fetchStatus` là như thế nào?

Chỉ cần nhớ

- `status` cho thông tin `data` có hay không
- `fetchStatus` cho thông tin về `queryFn` có đang chạy hay không

## Cơ chế caching

Một data mà đã `stale` thì khi gọi lại query của data đó, nó sẽ fetch lại api. Nếu không `stale` thì không fetch lại api (đối với trường hợp `staleTime` giữa các lần giống nhau)

> Còn đối với trường hợp `staleTime` giữa 2 lần khác nhau thì nếu data của lần query thứ 1 xuất hiện lâu hơn thời gian `staleTime` của lần query thứ 2 thì nó sẽ bị gọi lại ở lần thứ 2, dù cho có stale hay chưa.
> Ví dụ: `useQuery({ queryKey: ['todos'], queryFn: fetchTodos, staleTime: 10*1000 })` xuất hiện 5s trước, bây giờ chúng ta gọi lại `useQuery({ queryKey: ['todos'], queryFn: fetchTodos, staleTime: 2*1000 })` thì rõ ràng cái data của lần 1 dù nó chưa được cho là stale nhưng nó xuất hiện 5s trước và lâu hơn thời gian staleTime là 2s nên nó sẽ bị gọi lại ở lần 2.

Một data mà bị xóa khỏi bộ nhớ (tức là quá thời gian `cacheTime`) thì khi gọi lại query của data đó, nó sẽ fetch lại api. Nếu còn chưa bị xóa khỏi bộ nhớ nhưng đã `stale` thì nó sẽ trả về data cached và fetch api ngầm, sau khi fetch xong nó sẽ update lại data cached và trả về data mới cho bạn.

Caching là một vòng đời của:

- Query Instance có hoặc không cache data
- Fetch ngầm (background fetching)
- Các inactive query
- Xóa cache khỏi bộ nhớ (Garbage Collection)

Một ví dụ như thế này cho anh em dễ hiều:

Giả sử chúng ta dùng `cacheTime` mặc định là **5 phút** và `staleTime` là `0`.

```jsx
function A() {
  const result = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
}
function B() {
  const result = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
}
function C() {
  const result = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
}
```

- `A` component được mount
  - Vì không có query nào với `['todos']` trước đó, nó sẽ fetch data
  - Khi fetch xong, data sẽ được cache dưới key là `['todos']`
  - hook đánh dấu data là `stale` (cũ) vì sau `0`s
- Bây giờ thì `B` component được mount ở một nơi nào đó
  - Vì cache data `['todos']` đã có trước đó, data từ cache sẽ trả về ngay lập tức cho component `B`
  - Vì cache data `['todos']` được cho là đã `stale` nên nó sẽ fetch api tại component `B`
    - Không quan trọng function `fetchTodos` ở `A` và `B` có giống nhau hay không, việc fetch api tại `B` sẽ cập nhật tất cả các state query liên quan của `B` và `A` vì 2 component cùng key => cùng subcribe đến một data
  - Khi fetch thành công, cache data `['todos']` sẽ được cập nhật, cả 2 comonent `A` và `B` cũng được cập nhật data mới
- Bây giờ thì `A` và `B` unmount, không còn sử dụng nữa, không còn subcribe đến cache data `['todos']` nữa nên data `['todos']` bị cho là `inactive`
  - Vì `inactive` nên `cacheTime` sẽ bắt đầu đếm ngược 5 phút
- Trước khi `cacheTime` hết thì ông `C` comopnent được mount. cache data `['todos']` được trả về ngay lập tức cho `C` và `fetchTodos` sẽ chạy ngầm. Khi nó hoàn thành thì sẽ cập nhật lại cache với data mới.
- Cuối cùng thì `C` unmount
- Không còn ai subcribe đến cache data `['todos']` trong 5 phút tiếp theo nữa và cache data `['todos']` bị xóa hoàn toàn
