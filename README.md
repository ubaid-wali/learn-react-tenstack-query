# 🚀 TanStack Query (React Query) - Complete Learning Guide

> **TanStack Query** is one of the most powerful tools for managing server-side state in React applications. It simplifies data fetching, caching, mutations, and synchronization with your server state.

## 📋 Table of Contents
- [What is TanStack Query?](#-what-is-tanstack-query)
- [Key Features](#-key-features)
- [Installation & Setup](#-installation--setup)
- [Core Concepts](#-core-concepts)
- [Hooks Overview](#-hooks-overview)
- [Advanced Features](#-advanced-features)
- [Complete Cheatsheet](#-complete-cheatsheet)
- [Best Practices](#-best-practices)
- [Useful Links](#-useful-links)

## 🎯 What is TanStack Query?

TanStack Query (formerly React Query) is a library that helps you manage the state of data you fetch from servers, like APIs, in your React applications. It handles the complex parts of data fetching and provides a simple, declarative API.

### 🔄 The Problem It Solves
```
HTTP Request  ──────► Server
              ◄────── Response
```

Traditional approach with `useState` + `useEffect` + `Context API` requires a lot of boilerplate code for:
- Loading states
- Error handling  
- Caching
- Background refetching
- Optimistic updates

## ✨ Key Features

### 🎯 **Data Fetching Made Easy**
With a simple `useQuery` hook, fetching data becomes super easy.

### ⚡ **Built-in Loading and Error States**
No need to write custom code for handling loading, error, or success states.

### 💾 **Automatic Caching**
React Query automatically caches your data and serves it from cache when possible.

### 🔄 **Background Refetching**
If your data gets stale or out of date, TanStack Query can refetch it in the background.

### 📄 **Pagination and Infinite Scrolling**
Handling pagination or infinite scrolling? React Query has you covered with tools specifically designed for those complex use cases.

### 🎭 **Optimistic Updates**
Update your UI immediately and rollback if the server request fails.

### 🔄 **Automatic Retries**
Failed requests are automatically retried with exponential backoff.

### 🖥️ **Window Focus Refetching**
Automatically refetch data when the user returns to your app.

## 🚀 Installation & Setup

```bash
npm install @tanstack/react-query
# or
yarn add @tanstack/react-query
```

### Basic Setup

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## 🧠 Core Concepts

### 🔑 Query Client
The **Query Client** is the core part of the react-query library. It manages the caching, background fetching, data synchronization, and other query-related logic.

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    },
  },
})
```

### 🗝️ Query Keys
The `queryKey` is typically an array or string that uniquely identifies a query. It allows React Query to determine if the data in the cache is associated with a particular request.

```jsx
// String key
useQuery({ queryKey: ['users'], queryFn: fetchUsers })

// Array key with parameters
useQuery({ queryKey: ['user', userId], queryFn: () => fetchUser(userId) })

// Complex key
useQuery({ 
  queryKey: ['posts', { page: 1, limit: 10, status: 'published' }], 
  queryFn: fetchPosts 
})
```

### ⏰ Stale Time vs GC Time

#### **Stale Time** 🕐
- Determines how long fetched data is considered **fresh**
- Default: `0` (data becomes stale immediately)
- Fresh data won't trigger background refetches

```jsx
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000 // 5 minutes
})
```

#### **GC Time** 🗑️ (Garbage Collection Time)
- In React Query v5, `cacheTime` was renamed to `gcTime`
- How long inactive queries stay in cache before being garbage collected
- Default: `5 minutes`

## 🎣 Hooks Overview

### 📥 useQuery - Data Fetching
Used for **reading** data (GET requests) from an API and automatically caches the result.

```jsx
import { useQuery } from '@tanstack/react-query'

function Users() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      return response.json()
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  )
}
```

### ✏️ useMutation - Data Modification
Used for operations that **modify** data (POST, PUT, DELETE requests).

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateUser() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      console.error('Failed to create user:', error)
    }
  })

  return (
    <button 
      onClick={() => mutation.mutate({ name: 'John Doe', email: 'john@example.com' })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Creating...' : 'Create User'}
    </button>
  )
}
```

### ♾️ useInfiniteQuery - Infinite Scrolling
Perfect for pagination and infinite scrolling scenarios.

```jsx
import { useInfiniteQuery } from '@tanstack/react-query'

function InfiniteUsers() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 1 }) => fetchUsers(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined
    }
  })

  return (
    <div>
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.users.map(user => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      ))}
      
      <button 
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading more...' : 'Load More'}
      </button>
    </div>
  )
}
```

## 🔥 Advanced Features

### 🔄 Polling (Real-time Updates)
Automatically refetch data at regular intervals.

```jsx
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  refetchInterval: 1000, // Refetch every second
  refetchIntervalInBackground: true // Continue polling in background
})
```

### 🎯 Optimistic Updates
Update UI immediately, rollback on failure.

```jsx
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUserData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['users'] })
    
    // Snapshot previous value
    const previousUsers = queryClient.getQueryData(['users'])
    
    // Optimistically update
    queryClient.setQueryData(['users'], old => 
      old.map(user => user.id === newUserData.id ? newUserData : user)
    )
    
    return { previousUsers }
  },
  onError: (err, newUserData, context) => {
    // Rollback on error
    queryClient.setQueryData(['users'], context.previousUsers)
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }
})
```

### 🎚️ Query Invalidation
Force queries to refetch fresh data.

```jsx
const queryClient = useQueryClient()

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['users'] })

// Invalidate multiple queries
queryClient.invalidateQueries({ queryKey: ['users'], exact: false })

// Invalidate all queries
queryClient.invalidateQueries()
```

## 📖 Complete Cheatsheet

### 🎣 Query Hooks

| Hook | Purpose | Use Case |
|------|---------|----------|
| `useQuery` | Fetch & cache data | GET requests, reading data |
| `useMutation` | Modify data | POST, PUT, DELETE requests |
| `useInfiniteQuery` | Paginated data | Infinite scrolling, pagination |
| `useQueries` | Multiple queries | Fetch multiple endpoints |
| `useSuspenseQuery` | Suspense support | React Suspense integration |

### ⚙️ Query Options

```jsx
useQuery({
  queryKey: ['key'],
  queryFn: fetchData,
  enabled: true,              // Enable/disable query
  staleTime: 0,               // How long data stays fresh
  gcTime: 5 * 60 * 1000,      // Cache time before garbage collection
  refetchOnMount: true,       // Refetch when component mounts
  refetchOnWindowFocus: true, // Refetch when window gets focus
  refetchOnReconnect: true,   // Refetch when reconnecting
  retry: 3,                   // Number of retry attempts
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  select: data => data.results, // Transform data
  placeholderData: [],        // Placeholder while loading
  initialData: [],            // Initial data
})
```

### 🔄 Mutation Options

```jsx
useMutation({
  mutationFn: async (data) => {
    // Your mutation logic
  },
  mutationKey: ['mutation-key'], // Optional key
  onMutate: async (variables) => {
    // Before mutation starts
  },
  onSuccess: (data, variables, context) => {
    // On successful mutation
  },
  onError: (error, variables, context) => {
    // On mutation error
  },
  onSettled: (data, error, variables, context) => {
    // After mutation (success or error)
  }
})
```

### 🧰 Query Client Methods

```jsx
const queryClient = useQueryClient()

// Get cached data
const data = queryClient.getQueryData(['users'])

// Set cached data
queryClient.setQueryData(['users'], newData)

// Invalidate queries
queryClient.invalidateQueries({ queryKey: ['users'] })

// Remove queries from cache
queryClient.removeQueries({ queryKey: ['users'] })

// Cancel queries
queryClient.cancelQueries({ queryKey: ['users'] })

// Refetch queries
queryClient.refetchQueries({ queryKey: ['users'] })

// Get query state
const queryState = queryClient.getQueryState(['users'])
```

### 📊 Query States

```jsx
const { 
  data,              // The data returned from queryFn
  error,             // Error object if query failed
  isLoading,         // First time loading
  isFetching,        // Any time fetching (including background)
  isError,           // Query has error
  isSuccess,         // Query succeeded
  isStale,           // Data is stale
  isPending,         // Query is pending (loading or error)
  refetch,           // Function to manually refetch
  remove,            // Remove query from cache
} = useQuery({ queryKey: ['data'], queryFn: fetchData })
```

### 🔄 Mutation States

```jsx
const {
  mutate,            // Function to trigger mutation
  mutateAsync,       // Async version of mutate
  data,              // Data returned from mutation
  error,             // Error if mutation failed
  isIdle,            // Mutation hasn't started
  isPending,         // Mutation is in progress
  isError,           // Mutation failed
  isSuccess,         // Mutation succeeded
  reset,             // Reset mutation state
} = useMutation({ mutationFn: updateData })
```

### 🎯 Common Patterns

#### Dependent Queries
```jsx
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId)
})

const { data: posts } = useQuery({
  queryKey: ['posts', user?.id],
  queryFn: () => fetchUserPosts(user.id),
  enabled: !!user?.id // Only run when user exists
})
```

#### Parallel Queries
```jsx
const userQuery = useQuery({ queryKey: ['user'], queryFn: fetchUser })
const postsQuery = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
const profileQuery = useQuery({ queryKey: ['profile'], queryFn: fetchProfile })

// Or use useQueries for dynamic number of queries
const queries = useQueries({
  queries: userIds.map(id => ({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id)
  }))
})
```

#### Conditional Queries
```jsx
useQuery({
  queryKey: ['posts', filters],
  queryFn: () => fetchPosts(filters),
  enabled: Object.keys(filters).length > 0
})
```

## 🎯 Best Practices

### 1. 🔑 **Query Key Structure**
```jsx
// ❌ Don't
useQuery({ queryKey: 'users', queryFn: fetchUsers })

// ✅ Do - Use arrays for better invalidation
useQuery({ queryKey: ['users'], queryFn: fetchUsers })
useQuery({ queryKey: ['users', userId], queryFn: () => fetchUser(userId) })
```

### 2. 📝 **Query Functions**
```jsx
// ❌ Don't - Inline functions
useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(res => res.json())
})

// ✅ Do - Separate query functions
const fetchUsers = async () => {
  const response = await fetch('/api/users')
  if (!response.ok) throw new Error('Failed to fetch users')
  return response.json()
}

useQuery({ queryKey: ['users'], queryFn: fetchUsers })
```

### 3. 🎯 **Error Handling**
```jsx
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  retry: (failureCount, error) => {
    if (error.status === 404) return false
    return failureCount < 3
  },
  throwOnError: (error) => error.status >= 500
})
```

### 4. 🔄 **Loading States**
```jsx
// Use different loading states appropriately
const { data, isLoading, isFetching, isPending } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers
})

// isLoading: first time loading
// isFetching: any fetch (including background)
// isPending: loading OR error state
```

### 5. 🎭 **Optimistic Updates Pattern**
```jsx
const useOptimisticMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateItem,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['items'] })
      const previousItems = queryClient.getQueryData(['items'])
      
      queryClient.setQueryData(['items'], old => 
        old?.map(item => item.id === newItem.id ? newItem : item)
      )
      
      return { previousItems }
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(['items'], context.previousItems)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    }
  })
}
```

## 🛠️ DevTools

Install React Query DevTools for debugging:

```bash
npm install @tanstack/react-query-devtools
```

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>My App</div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## 📚 Useful Links

- 📖 [Official Documentation](https://tanstack.com/query/latest)
- 🎥 [TanStack Query Tutorial](https://www.youtube.com/watch?v=novnyCaa7To)
- 📝 [Migration Guide v4 to v5](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5)
- 🐛 [GitHub Repository](https://github.com/TanStack/query)
- 💬 [Discord Community](https://discord.com/invite/WrRKjPJ)
- 🎯 [Examples](https://tanstack.com/query/latest/docs/framework/react/examples/simple)
- 📊 [React Query DevTools](https://github.com/TanStack/query/tree/main/packages/react-query-devtools)

## 🎓 Summary

TanStack Query makes working with server-side data in React a breeze. It's fast, efficient, and reduces the amount of boilerplate code you need to write. If you're working on any app that relies on API data, this tool is an absolute game-changer! 🚀

### Key Takeaways:
- ✅ Simplifies data fetching with powerful caching
- ✅ Handles loading, error, and success states automatically  
- ✅ Provides background refetching and real-time updates
- ✅ Supports advanced patterns like optimistic updates
- ✅ Great developer experience with DevTools
- ✅ Reduces boilerplate code significantly

---

*Happy querying! 🎉*