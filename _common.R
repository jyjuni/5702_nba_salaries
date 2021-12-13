knitr::opts_chunk$set(
  echo = FALSE,
  message = FALSE,
  warning = FALSE
)

# dependencies
library(GGally)
library(ggplot2)
library(dplyr)
library(tidyr)
library(prob)
library(hexbin)
library(tidyverse)
library(naniar)
library(patchwork)
library(ggcorrplot)
library(ggridges)

# A function for captioning and referencing images
fig <- local({
  i <- 0
  ref <- list()
  list(
    cap=function(refName, text) {
      i <<- i + 1
      ref[[refName]] <<- i
      paste("Figure ", i, ": ", text, sep="")
    },
    ref=function(refName) {
      ref[[refName]]
    })
})