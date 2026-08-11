package io.nology.todos.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfiguration {
    @Bean ModelMapper ModelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setSkipNullEnabled(true).setPreferNestedProperties(false).setMatchingStrategy(MatchingStrategies.STRICT);

        mapper.addConverter(ctx -> {
            String source = ctx.getSource();
            return source == null ? null : source.trim().replaceAll("\\s+", " ");
        }, String.class, String.class);
        return mapper;
    }
}
