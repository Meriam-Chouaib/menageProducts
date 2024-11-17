import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { Pagination, Stack, Typography } from '@mui/material'
import CardItem from '../../../components/CardItem/CardItem'
import { StackStyled } from './ListProducts.style'
import ProductModal from '../../../components/Modal/ProductModal'
import AddButton from '../../../components/Buttons/AddButton/AddButton'
import SearchInput from '../../../components/SearchInput/SearchInput'
import { Product, IProduct } from '../../../types/models/Product'
import { useProducts } from '../../../hooks/useDebounce/useProducts'
import usePaginator from '../../../hooks/usePaginator'
import { initialProductsPaginator } from './ListProducts.constants'
import Paginator from '../../../components/Paginator/Paginator'

const ListProducts = () => {
  const [search, setSearch] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { paginator, onChangePage } = usePaginator({
    ...initialProductsPaginator,

    rowsPerPage: 8,
  })
  const {
    productsToShow,
    isLoading,
    handleDelete,
    handleUpdate,
    handleCreate,
    productsResponse,
  } = useProducts(search, paginator)

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setModalTitle('Edit Product')
    setOpenModal(true)
  }

  const openCreateModal = () => {
    setSelectedProduct(null)
    setModalTitle('Create Product')
    setOpenModal(true)
  }

  const handleModalSubmit = (product: IProduct) => {
    if (selectedProduct && selectedProduct.id != undefined) {
      handleUpdate(product, selectedProduct.id)
    } else {
      handleCreate(product)
    }
    setOpenModal(false)
  }

  return (
    <>
      <StackStyled justifyContent='space-between'>
        <AddButton label='Add Product' onClick={openCreateModal} />
        <SearchInput
          search={search}
          setSearch={setSearch}
          handleSubmit={() => {
            console.log('im here')
          }}
        />
      </StackStyled>

      {isLoading ? (
        <StackStyled width={'100%'} height={'100%'} justifyContent={'center'}>
          <ClipLoader color='#36d7b7' loading size={100} />
        </StackStyled>
      ) : (
        <>
          <StackStyled>
            {productsToShow.map((product) => (
              <CardItem
                key={`product-item-${product.id}`}
                {...product}
                onDelete={() => product?.id && handleDelete(product.id)}
                onEdit={() => openEditModal(product)}
              />
            ))}
          </StackStyled>

          <Paginator
            nbPages={productsResponse.nbPages}
            onChange={(_e, page) => onChangePage(page)}
          />
        </>
      )}

      {!isLoading && productsToShow.length === 0 && (
        <Typography>No products found</Typography>
      )}

      <ProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleModalSubmit}
        title={modalTitle}
        productToEdit={selectedProduct}
      />
    </>
  )
}

export default ListProducts