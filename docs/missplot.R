missplot <- function(mydata, percent=FALSE){
  missing_patterns <- data.frame(is.na(mydata)) %>%
    group_by_all() %>%
    count(name = "count", sort = TRUE) %>%
    ungroup()
  
  missing_patterns <- missing_patterns %>% rownames_to_column("id")
  
  missing_patterns_tidy <- missing_patterns %>%
    pivot_longer(-c(id,count), names_to = "key", values_to = "missing") %>% 
    group_by(id) %>% mutate(complete_cases = sum(missing) == 0)
  
  # main tile graph
  p1 <- missing_patterns_tidy %>%
    ggplot(aes(x = fct_reorder(key, -missing, sum), y = fct_rev(id), fill = missing)) +
    geom_tile(color = "white", aes(alpha = complete_cases, fill=missing)) +
    xlab("variable") +
    ylab("missing pattern") +
    scale_fill_manual(values= c("grey", "mediumpurple")) +
    scale_alpha_manual(values= c("FALSE"=0.7), guide = FALSE) +
    theme_bw() +
    theme(legend.position = "none", panel.grid.major = element_blank(), panel.grid.minor = element_blank()) +
    scale_x_discrete(label=abbreviate)
  
  
  # top graph count by category
  missing_rowcount <- mydata %>% summarise_all(~ sum(is.na(.))) %>% pivot_longer(everything(), names_to = c("variable"))
  p2 <-  missing_rowcount %>%
    ggplot(aes(x = fct_reorder(variable, -value), y = value)) +
    geom_bar(stat="identity", fill="cornflowerblue", alpha = 0.7)+
    ggtitle("Missing value patterns") +
    xlab("") +
    ylab("num rows \n missing") +
    theme_bw() +
    theme(panel.grid.major.x = element_blank(),
          panel.grid.minor.x = element_blank(),
          panel.grid.minor.y = element_blank()) + 
    scale_x_discrete(label=abbreviate)
  
  # using the raw missing_patter dataframe, but add one column filter complete_cases 
  missing_patterns$complete_cases <- ifelse(rowSums(missing_patterns[sapply(missing_patterns, is.logical)]), F, T)
  
  # right graph count by patterns
  p3 <- missing_patterns %>% 
    ggplot(aes(x = fct_rev(id), y = count)) + 
    geom_bar(stat="identity", fill="cornflowerblue", aes(alpha = complete_cases)) +
    coord_flip() +
    xlab("") +
    ylab("row count") +
    scale_alpha_manual(values= c("FALSE"=0.7), guide = "none") +
    theme_bw() +
    theme(panel.grid.major.y = element_blank(),
          panel.grid.minor.y = element_blank()) + 
    scale_x_discrete(label=abbreviate)
  
  
  if(percent == TRUE){
    # top graph percent by rows
    missing_rowcount <- mydata %>% summarise_all(~ sum(is.na(.))/length(.)*100) %>% pivot_longer(everything(), names_to = c("variable"))
    p2 <-  missing_rowcount %>%
      ggplot(aes(x = fct_reorder(variable, -value), y = value)) + 
      geom_bar(stat="identity", fill="cornflowerblue", alpha = 0.7)+
      ylim(0,100) + 
      ggtitle("Missing value patterns") +
      xlab("") + 
      ylab("% row \n missing") + 
      theme_bw() + 
      theme(panel.grid.major.x = element_blank(),
            panel.grid.minor.x = element_blank(),
            panel.grid.minor.y = element_blank()) + 
      scale_x_discrete(label=abbreviate)
    
    # using the raw missing_patter dataframe, but add one column filter complete_cases
    missing_patterns$complete_cases <- ifelse(rowSums(missing_patterns[sapply(missing_patterns, is.logical)]), F, T)
    
    # right graph count by patterns
    p3 <- missing_patterns %>% dplyr::mutate(percentage = count/nrow(mydata)*100) %>% 
      ggplot(aes(x = fct_rev(id), y = percentage)) + 
      geom_bar(stat="identity", fill="cornflowerblue", aes(alpha = complete_cases)) +
      coord_flip() +
      xlab("") +
      ylab("% row") + 
      ylim(0,100) + 
      scale_alpha_manual(values= c("FALSE"=0.7), guide = "none") +
      theme_bw() +
      theme(panel.grid.major.y = element_blank()) + 
      scale_x_discrete(label=abbreviate)
    
  }
  layout <- "
    BBBB#
    AAAAC
    AAAAC
    AAAAC
    AAAAC
    "
  p1 + p2 + p3 + 
    plot_layout(design = layout)
}

